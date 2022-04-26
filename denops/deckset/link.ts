export function wrapURL(text: string): string {
    const urlPattern = /(https?:\/\/[\w!?/+\-_~;.,*&@#$%()'[\]]+)/
    return text.replace(urlPattern, "[$1]($1)");
}