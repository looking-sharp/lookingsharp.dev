app.use(express.static('public', {
    setHeaders: (res, path) => {
      if (path.endsWith('.wasm')) {
        res.setHeader('Content-Type', 'application/wasm');
      }
    }
  }));