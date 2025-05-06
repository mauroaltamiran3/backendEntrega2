process.on('message', (msg) => {
    let resultado = 0;
    for (let i = 0; i < 5e8; i++) {
      resultado += i;
    }
    process.send(resultado);
  });