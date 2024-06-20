export default {
    "theme_rules": [
        {
            token: 'context',
            foreground: 'ffa500',
            fontStyle: 'italic underline'
        }
    ],
    "getCodeSuggessions": (monaco) => {
        return [{
            label: 'dbutil',
            kind: monaco.languages.CompletionItemKind.Text,
            insertText: 'DEProcessingDBUtil'
        },
        {
            label: 'log',
            kind: monaco.languages.CompletionItemKind.Text,
            insertText: '__logInfo("test message")'
        }
        ]
    }
}