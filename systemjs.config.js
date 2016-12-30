System.config({
    transpiler: 'typescript',
    typescriptOptions: {
        emitDecoratorMetadata: true
    },
    map: {
        'app': 'app',
        'rxjs': 'node_modules/rxjs',
        '@angular': 'node_modules/@angular'
    },
    packages: {
        'app': {
            main: 'main.ts',
            defaultExtension: 'ts'
        },
        'rxjs': {
            main: 'bundles/Rx.min.js'
        },
        '@angular/core': {
            main: 'bundles/core.umd.min.js'
        },
        '@angular/common': {
            main: 'bundles/common.umd.min.js'
        },
        '@angular/compiler': {
            main: 'bundles/compiler.umd.min.js'
        },
        '@angular/platform-browser': {
            main: 'bundles/platform-browser.umd.min.js'
        },
        '@angular/platform-browser-dynamic': {
            main: 'bundles/platform-browser-dynamic.umd.min.js'
        }
    }
});
