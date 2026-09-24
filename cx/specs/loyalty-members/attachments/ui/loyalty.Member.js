(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    function gridField(id, size, label, helper) {
        const props = { label: label, variant: "outlined" };
        if (helper) { props.helperText = helper; }
        const el = viewUtils.buildUIElement(id, props);
        return { id: id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }

    function section(sectionId, title, items) {
        const gridId = sectionId + "_g";
        const children = {};
        for (const it of items) { children[it.id] = it; }
        return { id: sectionId, jsontype: "mui.box", props: { sx: { mb: 2 } }, elements: {
            [sectionId + "_t"]: { id: sectionId + "_t", jsontype: "mui.typography",
                props: { variant: "subtitle2", children: title,
                         sx: { textTransform: 'none', fontSize: '0.85rem', fontWeight: 600, color: 'text.secondary', mb: 0.5 } } },
            [gridId]: { id: gridId, jsontype: "mui.box",
                props: { sx: { border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 } },
                elements: { [gridId + "_in"]: { id: gridId + "_in", jsontype: "mui.grid",
                    props: { container: true, columns: 12, spacing: 2 }, elements: children } } } } };
    }

    function sectionTitle(sectionId, title) {
        return { id: sectionId + "_t", jsontype: "mui.typography",
            props: { variant: "subtitle2", children: title,
                     sx: { textTransform: 'none', fontSize: '0.85rem', fontWeight: 600, color: 'text.secondary', mb: 0.5 } } };
    }

    return { main: function () {
        const root = model.getId() + "_root";
        const fid = (n) => model.fieldNameToModelId(n);

        // ---- Banner ------------------------------------------------------
        const bannerId = root + "_banner";
        const bannerSvgId = bannerId + "_bg";
        const bannerSvg = { id: bannerSvgId, jsontype: "ui.svg",
            props: { sx: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
                     svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 140" preserveAspectRatio="none"><defs><linearGradient id="bannerGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0B1F4B"/><stop offset="100%" stop-color="#5B2A86"/></linearGradient></defs><rect width="400" height="140" fill="url(#bannerGrad)"/></svg>' } };

        // Fields are styled from the WRAPPING box (descendant selectors reach
        // the inner input; props passed to buildUIElement itself do not).
        const nameBoxId = bannerId + "_namebox";
        const nameEl = viewUtils.buildUIElement(fid("fullName"), { variant: "standard" });
        const nameBox = { id: nameBoxId, jsontype: "mui.box", props: { sx: {
                '& .MuiInputBase-root': { color: '#FFFFFF' },
                '& .MuiInputBase-input': { color: '#FFFFFF', fontSize: '1.6rem', fontWeight: 600 },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' },
                '& .MuiInputBase-root:before': { borderBottomColor: 'rgba(255,255,255,0.4)' },
                '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.75)', marginTop: 0 } } },
            elements: { [nameEl.id]: nameEl } };

        const numberBoxId = bannerId + "_numberbox";
        const numberEl = viewUtils.buildUIElement(fid("memberNumber"), { variant: "standard" });
        const numberBox = { id: numberBoxId, jsontype: "mui.box", props: { sx: {
                '& .MuiInputBase-root': { color: '#D4AF37' },
                '& .MuiInputBase-input': { color: '#D4AF37', fontSize: '1.15rem', fontWeight: 600, letterSpacing: 1 },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' },
                '& .MuiInputBase-root:before': { borderBottomColor: 'rgba(255,255,255,0.4)' },
                '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.75)', marginTop: 0 } } },
            elements: { [numberEl.id]: numberEl } };

        const nameColId = bannerId + "_namecol";
        const nameCol = { id: nameColId, jsontype: "mui.stack", props: { spacing: 1, sx: { flex: 1 } },
            elements: { [nameBoxId]: nameBox, [numberBoxId]: numberBox } };

        const shieldId = bannerId + "_shield";
        const shield = { id: shieldId, jsontype: "ui.svg",
            props: { sx: { width: 64, height: 64, flexShrink: 0, mt: 1 },
                     svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2 L20 5 V11 C20 16.5 16.6 20.4 12 22 C7.4 20.4 4 16.5 4 11 V5 Z" fill="#D4AF37" stroke="#FFFFFF" stroke-width="1"/></svg>' } };

        const bannerContentId = bannerId + "_content";
        const bannerContent = { id: bannerContentId, jsontype: "mui.stack",
            props: { direction: "row", spacing: 3, alignItems: "flex-start", sx: { position: 'relative', p: 2.5 } },
            elements: { [nameColId]: nameCol, [shieldId]: shield } };

        const banner = { id: bannerId, jsontype: "mui.box",
            props: { sx: { position: 'relative', borderRadius: 2, overflow: 'hidden', mb: 2 } },
            elements: { [bannerSvgId]: bannerSvg, [bannerContentId]: bannerContent } };

        // ---- Points row --------------------------------------------------
        const starId = root + "_star";
        const star = { id: starId, jsontype: "mui.icon",
            props: { children: "star", sx: { color: '#D4AF37', fontSize: 40 } } };
        const pointsBoxId = root + "_pointsbox";
        const pointsEl = viewUtils.buildUIElement(fid("pointsBalance"), { variant: "standard" });
        const pointsBox = { id: pointsBoxId, jsontype: "mui.box",
            props: { sx: { flex: 1,
                '& .MuiInputBase-input': { color: '#D4AF37', fontSize: '2.2rem', fontWeight: 700 },
                '& .MuiInputLabel-root': { color: 'text.secondary', fontSize: '0.9rem' },
                '& .MuiFormHelperText-root': { marginTop: 0 } } },
            elements: { [pointsEl.id]: pointsEl } };
        const pointsRowId = root + "_pointsrow";
        const pointsRow = { id: pointsRowId, jsontype: "mui.stack",
            props: { direction: "row", spacing: 2, alignItems: "center", sx: { mb: 2, px: 1 } },
            elements: { [starId]: star, [pointsBoxId]: pointsBox } };

        // ---- Sections ----------------------------------------------------
        const identity = section(root + "_identity", "Membership", [
            gridField(fid("tier"), 4, "Tier"),
            gridField(fid("status"), 4, "Status", "New members start as pending."),
            gridField(fid("joinedDate"), 4, "Joined Date"),
            gridField(fid("birthday"), 4, "Birthday"),
            gridField(fid("marketingConsent"), 4, "Marketing Consent", "Agreed to marketing emails."),
            gridField(fid("notes"), 12, "Notes")
        ]);

        const addressEl = viewUtils.buildUIElement(fid("address"));
        const addressId = root + "_address";
        const address = { id: addressId, jsontype: "mui.box", props: { sx: { mb: 2 } }, elements: {
            [addressId + "_t"]: sectionTitle(addressId, "Home Address"),
            [addressId + "_box"]: { id: addressId + "_box", jsontype: "mui.box",
                props: { sx: { border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 } },
                elements: { [addressEl.id]: addressEl } } } };

        const cardsEl = viewUtils.buildUIElement(fid("cards"));
        const cardsId = root + "_cards";
        const cardsSec = { id: cardsId, jsontype: "mui.box", props: { sx: { mb: 2 } }, elements: {
            [cardsId + "_t"]: sectionTitle(cardsId, "Cards"),
            [cardsId + "_box"]: { id: cardsId + "_box", jsontype: "mui.box",
                props: { sx: { border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 } },
                elements: { [cardsEl.id]: cardsEl } } } };

        // Referral: kept mounted (required) but not shown.
        const refEl = viewUtils.buildUIElement(fid("referredBy"));
        const refMountId = root + "_refmount";
        const refMount = { id: refMountId, jsontype: "mui.box", elements: { [refEl.id]: refEl } };

        return { sx: { p: 2, maxWidth: 720, minWidth: 320, mx: 'auto' },
            elements: { [banner.id]: banner, [pointsRow.id]: pointsRow,
                        [identity.id]: identity, [address.id]: address, [cardsSec.id]: cardsSec,
                        [refMountId]: refMount } };
    } };
})();