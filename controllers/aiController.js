import axios from 'axios';
import stream from 'stream';
import util from 'util';

import https from 'https';
import QueryString from 'qs';

const imageUidRegexp = /src="([a-f0-9-]+)"/;
const pipeline = util.promisify(stream.pipeline);

export const mainAiFunction = async (req, res) => {
	const accessedTypes = ['image', 'text'];

	if (!accessedTypes.includes(req.body.generationType)) {
		return res.status(500).json({ message: 'invalid generation type' });
	}

	const tokenData = await getBearerToken();

	if (req.body.generationType === 'image') {
		const imageGenerateResult = await generateImage(tokenData.access_token);

		const imageStream = await getImageStream(
			imageGenerateResult,
			tokenData.access_token
		);

		const imageBase64 = await streamToBase64(imageStream);
		res.status(200).json(imageBase64);

		return;
	}

	const textGeneration = await generateText(tokenData.access_token);

	return res.status(200).json(textGeneration);
};

export async function generateText(accessToken) {
	const httpsAgent = new https.Agent({
		rejectUnauthorized: false,
	});

	const data = {
		model: 'GigaChat',
		messages: [
			{
				role: 'system',
				content:
					'Ты — ИИ, твоя задача помогать людям дополнять их статьи и генерировать их изображения в указанном стиле',
			},
			{
				role: 'user',
				content:
					'Напиши интересный короткий факт, буквально пару строк. Ответь только этим фактом, без приветствия',
			},
		],
		function_call: 'auto',
	};

	const url = 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions';

	const headers = {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		Authorization: `Bearer ${accessToken}`,
	};

	console.log('text gen started');

	const response = await axios({
		method: 'post',
		url: url,
		data,
		headers,
		httpsAgent: httpsAgent,
	});

	return response.data.choices[0].message.content;
}

export async function streamToBase64(imageStream) {
	const chunks = [];

	await pipeline(
		imageStream,
		new stream.Writable({
			write(chunk, encoding, callback) {
				chunks.push(chunk);
				callback();
			},
		})
	);

	const buffer = Buffer.concat(chunks);
	const base64Image = buffer.toString('base64');
	return 'data:image/jpeg;base64,' + base64Image;
}

export async function getImageStream(imageUid, token) {
	const httpsAgent = new https.Agent({
		rejectUnauthorized: false,
	});

	const streamingImage = await axios({
		method: 'get',
		url: `https://gigachat.devices.sberbank.ru/api/v1/files/${imageUid}/content`,
		responseType: 'stream',
		headers: {
			Accept: 'application/jpg',
			Authorization: `Bearer ${token}`,
		},
		httpsAgent: httpsAgent,
	});

	return streamingImage.data;
}

export async function generateImage(accessToken) {
	const httpsAgent = new https.Agent({
		rejectUnauthorized: false,
	});

	const data = {
		model: 'GigaChat',
		messages: [
			{
				role: 'system',
				content: 'Ты — Василий Кандинский',
			},
			{
				role: 'user',
				content: 'Нарисуй розового кота',
			},
		],
		function_call: 'auto',
	};

	const url = 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions';

	const headers = {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		Authorization: `Bearer ${accessToken}`,
	};

	const imageUid = await axios({
		method: 'post',
		url: url,
		data,
		headers,
		httpsAgent: httpsAgent,
	});

	return imageUid.data.choices[0].message.content.match(imageUidRegexp)[1];
}

export async function getBearerToken() {
	const httpsAgent = new https.Agent({
		rejectUnauthorized: false,
	});

	console.log('req started');
	const url = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';

	const data = QueryString.stringify({
		scope: process.env.AI_SCOPE,
	});

	const headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
		Accept: 'application/json',
		RqUID: process.env.AI_CLIENT_SECRET,
		Authorization: `Basic ${process.env.AI_AUTH_DATA}`,
	};

	const response = await axios({
		method: 'post',
		url: url,
		headers: headers,
		data: data,
		httpsAgent: httpsAgent,
	}).catch((error) => {
		console.log('error in request', error.response.data);
	});

	return response.data;
}
