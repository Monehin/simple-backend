import app from '../app';
import http from 'http';

const PORT = process.env.PORT || '3001';

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Your currently running on port ${PORT}`);
});
