export const apiUrl =
	process.env.NODE_ENV !== 'production'
		? 'http://127.0.0.1:8000'
		: 'https://whispering-fortress-65647.herokuapp.com/api'