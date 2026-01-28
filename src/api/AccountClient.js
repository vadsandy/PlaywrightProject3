class AccountClient {
    constructor(request) {
        this.request = request;
        this.baseUrl = 'https://demoqa.com';
    }

    async loginAndGetToken(username, password) {
        const response = await this.request.post(`${this.baseUrl}/Account/v1/Login`, {
            data: { userName: username, password: password }
        });

        if (!response.ok()) {
            throw new Error(`API Login Failed: ${response.status()}`);
        }
        return await response.json();
    }
}

// Make sure this is exactly like this:
module.exports = AccountClient;