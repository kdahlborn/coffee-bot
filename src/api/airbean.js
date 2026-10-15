const AIRBEAN_URL = 'https://santosnr6.github.io/Data/airbean.json';

export const fetchMenu = async () => {
    const response = await fetch(AIRBEAN_URL);

    if (!response.ok) {
        throw new Error('Kunde inte hämta menyn');
    }

    return await response.json();
};
