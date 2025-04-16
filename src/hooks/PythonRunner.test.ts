import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { PythonRunner } from './PythonRunner';

describe('PythonRunner Hook', () => {
  //mock pyodide globally befpre each test
  beforeEach(() => {
    globalThis.window.loadPyodide = vi.fn().mockResolvedValue({
      runPythonAsync: vi.fn(async (code: string) => {
        if (code.includes('1 / 0')) throw new Error('ZeroDivisionError');
        if (code.includes('print')) return undefined;
        return eval(code); // simulates return value
      }),
      loadPackage: vi.fn().mockResolvedValue(undefined),
      setStdout: vi.fn(),
      setStderr: vi.fn(),
    });
  });

  //wait helper for effects
  const waitForEffect = () => act(() => new Promise((r) => setTimeout(r, 0)));

  it('initializes Pyodide and updates status to ready', async () => {
    const { result } = renderHook(() => PythonRunner());
    await waitForEffect();
    expect(result.current.status).toBe('ready');
  });

  it('handles return values (simple expressions)', async () => {
    const { result } = renderHook(() => PythonRunner());
    await waitForEffect();

    await act(async () => {
      await result.current.runPython("5 + 5");
    });

    expect(result.current.result.output).toContain(''); // no print, no stdout
    expect(result.current.result.error).toBe('');
  });

  it('captures printed output', async () => {
    const pyodideMock = await globalThis.window.loadPyodide({ indexURL: '' });
    pyodideMock.setStdout = vi.fn(({ batched }) => batched?.('Hello\n'));

    const { result } = renderHook(() => PythonRunner());
    await waitForEffect();

    await act(async () => {
      await result.current.runPython("print('Hello')");
    });

    expect(result.current.result.output).toContain('Hello');
    expect(result.current.result.error).toBe('');
  });

  it('captures Python errors', async () => {
    const { result } = renderHook(() => PythonRunner());
    await waitForEffect();

    await act(async () => {
      await result.current.runPython("1 / 0");
    });

    expect(result.current.result.output).toBe('');
    expect(result.current.result.error).toContain('ZeroDivisionError');
  });

  it('handles print and return together', async () => {
    const pyodideMock = await globalThis.window.loadPyodide({ indexURL: '' });
    pyodideMock.setStdout = vi.fn(({ batched }) => batched?.('Hello\n'));

    const { result } = renderHook(() => PythonRunner());
    await waitForEffect();

    await act(async () => {
      await result.current.runPython("print('Hello')\n42");
    });

    expect(result.current.result.output).toContain('Hello');
    expect(result.current.result.error).toBe('');
  });

  it('handles code with no return and no print', async () => {
    const { result } = renderHook(() => PythonRunner());
    await waitForEffect();

    await act(async () => {
      await result.current.runPython("x = 10");
    });

    expect(result.current.result.output).toBe(''); // no print output
    expect(result.current.result.error).toBe('');
  });

  it('differentiates print with commas vs concatenation', async () => {
    const pyodideMock = await globalThis.window.loadPyodide({ indexURL: '' });
    pyodideMock.setStdout = vi.fn(({ batched }) => batched?.('a b\n'));

    const { result } = renderHook(() => PythonRunner());
    await waitForEffect();

    await act(async () => {
      await result.current.runPython("print('a', 'b')");
    });

    expect(result.current.result.output).toContain('a b');
  });

  it('formats print output with end and sep', async () => {
    const pyodideMock = await globalThis.window.loadPyodide({ indexURL: '' });
    pyodideMock.setStdout = vi.fn(({ batched }) => batched?.('a-bEND'));

    const { result } = renderHook(() => PythonRunner());
    await waitForEffect();

    await act(async () => {
      await result.current.runPython("print('a', 'b', sep='-', end='END')");
    });

    expect(result.current.result.output).toContain('a-bEND');
  });
});
