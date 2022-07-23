import app from './app';
import { db } from './data/connection';
import { userRepository } from './repositories/user.repository';

const PORT = process.env.PORT || 3000;

db.checkConnection();
userRepository.createInitialUserIfDbIsEmpty();

app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`);
});
