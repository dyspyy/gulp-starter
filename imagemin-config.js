// imagemin-config.js
(async () => {
    const imagemin = (await import('imagemin')).default;
    const avif = (await import('imagemin-avif')).default;

    await imagemin(['src/img/*.png'], {
        destination: 'dist/images',
        plugins: [
            avif({quality: 50})
        ]
    });
})();



// imagemin src/img/* --out-dir=dist/images
// imagemin src/img/* --plugin=webp --out-dir=dist/images
//