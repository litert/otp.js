module.exports = {
    'extends': ['@commitlint/config-conventional'],
    'defaultIgnores': false,
    'rules': {
        'type-enum': [2, 'always', [
            'fix',
            'add',
            'build'
        ]],
        'scope-enum': [2, 'always', [
            'hotp',
            'totp',
            'generator',
            'test',
            'doc',
            'deps',
            'lint',
            'branch',
            'project'
        ]],
        'scope-empty': [2, 'never'],
        'subject-min-length': [2, 'always', 5],
        'subject-max-length': [2, 'always', 50],
    }
};
