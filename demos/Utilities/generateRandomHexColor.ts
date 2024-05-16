export default function generateRandomHexColor(): string {
    const characters = 'abcdef0123456789';
    return new Array(6).fill(null).reduce((s) => s + characters[Math.floor(Math.random() * characters.length)], '#');
}
