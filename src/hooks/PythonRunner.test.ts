import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { PythonRunner } from './PythonRunner';

describe('PythonRunner Hook', () => {
  beforeEach(() => {
    globalThis.window.loadPyodide = vi.fn().mockResolvedValue({
      runPythonAsync: vi.fn(async (code: string) => {
        if (code.includes('1 / 0')) throw new Error('ZeroDivisionError');
        if (code.includes('print')) return undefined;
        return eval(code); // very basic mock
      }),
      loadPackage: vi.fn().mockResolvedValue(undefined),
      setStdout: vi.fn(),
      setStderr: vi.fn(),
    });
  });

  it('initializes Pyodide and updates status to ready', async () => {
    const { result } = renderHook(() => PythonRunner());

    // wait for useEffect to complete
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.status).toBe('ready');
  });

  it('runs Python code and captures stdout', async () => {
    const mockStdout: string[] = [];
    const pyodideMock = await globalThis.window.loadPyodide({ indexURL: '' });

    // override setStdout to simulate output capture
    pyodideMock.setStdout = vi.fn(({ batched }) => {
      batched?.('Hello from Python\n');
    });
    pyodideMock.setStderr = vi.fn();

    const { result } = renderHook(() => PythonRunner());

    // wait for setup
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    await act(async () => {
      await result.current.runPython("print('Hello from Python')");
    });

    expect(result.current.result.output).toContain('Hello from Python');
    expect(result.current.result.error).toBe('');
  });

  it('captures Python errors', async () => {
    const pyodideMock = await globalThis.window.loadPyodide({ indexURL: '' });

    const { result } = renderHook(() => PythonRunner());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    await act(async () => {
      await result.current.runPython("1 / 0");
    });

    expect(result.current.result.output).toBe('');
    expect(result.current.result.error).toContain('ZeroDivisionError');
  });
});
