export const htmlEmailConfirmationCodeLetter = (code: string | null) => {
    return `
<h1>Thank for your registration</h1>
<p>To finish registration please follow the link below:
    <a href='https://google.com?code=${code}'>complete registration</a>
</p>
`;
};
