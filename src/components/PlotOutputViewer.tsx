export function PlotOutputViewer({ plotUrl, theme }: { plotUrl: string; theme: 'light' | 'dark' }) {
    const downloadPlot = () => {
      const link = document.createElement('a');
      link.href = plotUrl;
      link.download = 'plot.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  
    return (
      <div className={`plot-preview ${theme}`}>
        <div className="plot-container">
          <img src={plotUrl} alt="Generated plot" className="plot-image" />
        </div>
        <div className="plot-actions">
          <button onClick={downloadPlot} className="download-button">
            Download Plot
          </button>
        </div>
      </div>
    );
  }