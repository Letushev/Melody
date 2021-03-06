const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../../utils');

async function signup(_, args, context) {
  const hashedPassword = await bcrypt.hash(args.password, 10);
  const { password, ...user } = await context.prisma.createUser({ ...args, password: hashedPassword });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function login(_, args, context) {
  const user = await context.prisma.user({ nickname: args.nickname });
  if (!user) {
    throw new Error('Користувача з таким нікнеймом не існує');
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Неправильний пароль');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  delete user.password;

  return {
    token,
    user,
  };
}

async function deleteUser(_, args, context) {
  return await context.prisma.deleteUser({ id: args.id });
}

async function addUserImage(_, args, context) {
  const id = getUserId(context);
  return await context.prisma.updateUser({
    data: {
      image: args.image,
    },
    where: {
      id: id,
    }
  });
}

module.exports = {
  signup,
  login,
  deleteUser,
  addUserImage,
};
