



export default {
    "theme_rules": [
        {
            token: 'context',
            foreground: 'ffa500',
            fontStyle: 'italic underline'
        }
    ],
    "getCodeShortcuts": (monaco) => {
        return [
            {
                label: 'RestClientPlain',
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: 'RestClient'
            },
            {
                label: 'log',
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: '__logInfo("test message")'
            },
            {
                label: 'triggerbyuser',
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: 'IS_TRIGGERED_BY_USER'
            },
            {
                label: 'file_type',
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: 'file_type'
            },
            {
                label: 'context',
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: 'context'
            },
            {
                label: 'restClientGet',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: ['const systemName="ORACLE-EBS";',
                    'let AuthClient = await getAwaitAuthorizedRestClient(systemName);',
                    'const queryFilter = {};',
                    'const response = await AuthClient.get(`apiEndPoint`).query(queryFilter);'].join('\n'),
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'getAuthorizedRestClient'
            },
            {
                label: 'restClientPost',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: ['const systemName="ORACLE-EBS";',
                    'let AuthClient = await getAwaitAuthorizedRestClient(systemName);',
                    'const payload={};',
                    'const response = await AuthClient.post(`apiEndPoint`,{},payload);'].join('\n'),
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'getAuthorizedRestClient'
            }
        ]
    }
}
