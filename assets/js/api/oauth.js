'use strict';

const OAuth = {

    clientId: '3MVG97L7PWbPq6Uzjn3QC0WVmBAib3XV9nSbfd4qU2NTEqakHNncO_GUigNhlhL27aUltCnOcWQFxe5mdEb05',

    redirectUri: 'https://opencoreap.vercel.app/callback.html',

    login() {

        const authUrl =
            window.OPENCORE_SF_URL +
            '/services/oauth2/authorize' +
            '?response_type=token' +
            '&client_id=' + encodeURIComponent(this.clientId) +
            '&redirect_uri=' + encodeURIComponent(this.redirectUri);

        window.location.href = authUrl;

    },

    handleCallback() {

        if (!window.location.hash) {
            return;
        }

        const hash = new URLSearchParams(
            window.location.hash.substring(1)
        );

        const token = hash.get('access_token');

        if (token) {

            OcApi.Auth.setToken(token);

            window.location.href = 'dashboard.html';

        }

    },

    logout() {

        OcApi.Auth.clearToken();

        window.location.href = 'index.html';

    }

};

window.OAuth = OAuth;
