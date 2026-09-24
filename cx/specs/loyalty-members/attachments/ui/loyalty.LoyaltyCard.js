(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    return { main: function () {
        const root = model.getId() + "_root";
        const fid = (n) => model.fieldNameToModelId(n);

        const tileId = root + "_tile";
        const tileSvgId = tileId + "_bg";
        const tileSvg = { id: tileSvgId, jsontype: "ui.svg",
            props: { sx: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
                     svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 200" preserveAspectRatio="none"><defs><linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0F766E"/><stop offset="100%" stop-color="#06B6D4"/></linearGradient></defs><rect width="340" height="200" fill="url(#cardGrad)"/></svg>' } };

        const waveId = tileId + "_wave";
        const wave = { id: waveId, jsontype: "ui.svg",
            props: { sx: { position: 'absolute', top: 12, right: 12, width: 28, height: 28, opacity: 0.9 },
                     svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"><path d="M6 9 a5 5 0 0 1 0 6"/><path d="M9.5 6.5 a9 9 0 0 1 0 11"/><path d="M13 4 a13 13 0 0 1 0 16"/></svg>' } };

        const lastFourBoxId = tileId + "_lastfourbox";
        const lastFourEl = viewUtils.buildUIElement(fid("lastFour"), { variant: "standard" });
        const lastFourBox = { id: lastFourBoxId, jsontype: "mui.box",
            props: { sx: { width: 160,
                '& .MuiInputBase-input': { color: '#FFFFFF', fontSize: '1.5rem', fontWeight: 700, letterSpacing: 3 },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.75)' },
                '& .MuiInputBase-root:before': { borderBottomColor: 'rgba(255,255,255,0.4)' },
                '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.8)', marginTop: 0 } } },
            elements: { [lastFourEl.id]: lastFourEl } };

        const issuedBoxId = tileId + "_issuedbox";
        const issuedEl = viewUtils.buildUIElement(fid("issuedDate"), { variant: "standard" });
        const issuedBox = { id: issuedBoxId, jsontype: "mui.box",
            props: { sx: { width: 160,
                '& .MuiInputBase-input': { color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600 },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem' },
                '& .MuiInputBase-root:before': { borderBottomColor: 'rgba(255,255,255,0.4)' },
                '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.8)', marginTop: 0 } } },
            elements: { [issuedEl.id]: issuedEl } };

        const typeBoxId = tileId + "_typebox";
        const typeEl = viewUtils.buildUIElement(fid("cardType"), { variant: "standard" });
        const typeBox = { id: typeBoxId, jsontype: "mui.box",
            props: { sx: { width: 160,
                '& .MuiInputBase-input': { color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600 },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem' },
                '& .MuiInputBase-root:before': { borderBottomColor: 'rgba(255,255,255,0.4)' },
                '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.8)', marginTop: 0 } } },
            elements: { [typeEl.id]: typeEl } };

        const fieldsRowId = tileId + "_fieldsrow";
        const fieldsRow = { id: fieldsRowId, jsontype: "mui.stack",
            props: { direction: "row", spacing: 3, sx: { position: 'relative', px: 2.5, pb: 2 } },
            elements: { [issuedBoxId]: issuedBox, [typeBoxId]: typeBox } };

        const contentId = tileId + "_content";
        const content = { id: contentId, jsontype: "mui.stack",
            props: { spacing: 2, sx: { position: 'relative', p: 2.5, pb: 0 } },
            elements: { [lastFourBoxId]: lastFourBox } };

        const tile = { id: tileId, jsontype: "mui.box",
            props: { sx: { position: 'relative', borderRadius: 2, overflow: 'hidden', minHeight: 190, maxWidth: 340 } },
            elements: { [tileSvgId]: tileSvg, [waveId]: wave, [contentId]: content, [fieldsRowId]: fieldsRow } };

        return { sx: { p: 1, maxWidth: 380 }, elements: { [tile.id]: tile } };
    } };
})();