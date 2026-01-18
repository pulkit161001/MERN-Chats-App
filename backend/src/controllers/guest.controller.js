import { seedUsers } from "../seeds/user.seed.js";
export const getRandomGuestUser = (_, res) => {
	const randomIndex = Math.floor(Math.random() * seedUsers.length);
	const randomUser = seedUsers[randomIndex];

	res.status(200).json({
		fullName: randomUser.fullName,
		email: randomUser.email,
		password: randomUser.password,
	});
};
