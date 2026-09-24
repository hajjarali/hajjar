(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    function gridField(id, size, label, helper) {
        const props = { label: label, variant: "outlined" };
        if (helper) { props.helperText = helper; }
        const el = viewUtils.buildUIElement(id, props);
        return { id: id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }

    // A soft-grey rounded card with a gold-underlined section title.
    function section(sectionId, title, items) {
        const gridId = sectionId + "_g";
        const children = {};
        for (const it of items) { children[it.id] = it; }
        return { id: sectionId, jsontype: "mui.box", props: { sx: { bgcolor: '#F4F5F7', borderRadius: 2, p: 2, mb: 2 } }, elements: {
            [sectionId + "_t"]: { id: sectionId + "_t", jsontype: "mui.typography",
                props: { variant: "subtitle2", children: title,
                         sx: { textTransform: 'none', fontSize: '0.9rem', fontWeight: 700, color: 'text.secondary',
                               display: 'inline-block', borderBottom: '2px solid #D4AF37', paddingBottom: '2px', mb: 1 } } },
            [gridId]: { id: gridId, jsontype: "mui.grid",
                props: { container: true, columns: 12, spacing: 2 }, elements: children } } };
    }

    function sectionTitle(sectionId, title) {
        return { id: sectionId + "_t", jsontype: "mui.typography",
            props: { variant: "subtitle2", children: title,
                     sx: { textTransform: 'none', fontSize: '0.9rem', fontWeight: 700, color: 'text.secondary',
                           display: 'inline-block', borderBottom: '2px solid #D4AF37', paddingBottom: '2px', mb: 1 } } };
    }

    return { main: function () {
        const root = model.getId() + "_root";
        const fid = (n) => model.fieldNameToModelId(n);

        // ---- Banner ------------------------------------------------------
        const bannerId = root + "_banner";
        const bannerSvgId = bannerId + "_bg";
        const bannerSvg = { id: bannerSvgId, jsontype: "ui.svg",
            props: { sx: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
                     svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" preserveAspectRatio="none"><defs><linearGradient id="bannerGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0B1F4B"/><stop offset="100%" stop-color="#5B2A86"/></linearGradient></defs><rect width="400" height="150" fill="url(#bannerGrad)"/></svg>' } };

        const nameBoxId = bannerId + "_namebox";
        const nameEl = viewUtils.buildUIElement(fid("fullName"), { variant: "standard" });
        const nameBox = { id: nameBoxId, jsontype: "mui.box", props: { sx: {
                '& .MuiInputBase-input': { color: '#FFFFFF', fontSize: '1.6rem', fontWeight: 600 },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' },
                '& .MuiInputBase-root:before': { borderBottomColor: 'rgba(255,255,255,0.4)' },
                '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.75)', marginTop: 0 } } },
            elements: { [nameEl.id]: nameEl } };

        const numberBoxId = bannerId + "_numberbox";
        const numberEl = viewUtils.buildUIElement(fid("memberNumber"), { variant: "standard" });
        const numberBox = { id: numberBoxId, jsontype: "mui.box", props: { sx: {
                '& .MuiInputBase-input': { color: '#D4AF37', fontSize: '1.15rem', fontWeight: 600, letterSpacing: 1 },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' },
                '& .MuiInputBase-root:before': { borderBottomColor: 'rgba(255,255,255,0.4)' },
                '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.75)', marginTop: 0 } } },
            elements: { [numberEl.id]: numberEl } };

        // Status pill — coloured by the member's current status. The value is
        // read from the mounted status element at build time; when it cannot be
        // read the pill falls back to a neutral grey.
        const statusFieldId = fid("status");
        let sv = null;
        try { sv = String(getElement(statusFieldId, {}).getValue()); } catch (e) { sv = null; }
        if (sv === "null" || sv === "undefined") { sv = null; }
        const pillColors = { pending: '#F59E0B', active: '#10B981', frozen: '#3B82F6', closed: '#EF4444' };
        const pillColor = (sv && pillColors[sv.toLowerCase()]) || '#9E9E9E';
        const pillLabel = sv ? (sv.charAt(0).toUpperCase() + sv.slice(1)) : "Not set";
        const pillId = bannerId + "_statuspill";
        const pill = { id: pillId, jsontype: "mui.chip",
            props: { label: pillLabel, size: "small",
                     sx: { bgcolor: pillColor, color: '#FFFFFF', fontWeight: 600, mt: 1 } } };

        const nameColId = bannerId + "_namecol";
        const nameCol = { id: nameColId, jsontype: "mui.stack", props: { spacing: 1, sx: { flex: 1 } },
            elements: { [nameBoxId]: nameBox, [numberBoxId]: numberBox, [pillId]: pill } };

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

        // ---- Points card ---------------------------------------------------
        const pointsCardId = root + "_pointscard";
        const starId = pointsCardId + "_star";
        const star = { id: starId, jsontype: "mui.icon",
            props: { children: "star", sx: { color: '#D4AF37', fontSize: 40 } } };
        const pointsBoxId = pointsCardId + "_box";
        const pointsEl = viewUtils.buildUIElement(fid("pointsBalance"), { variant: "standard" });
        const pointsBox = { id: pointsBoxId, jsontype: "mui.box",
            props: { sx: { flex: 1,
                '& .MuiInputBase-input': { color: '#D4AF37', fontSize: '2.2rem', fontWeight: 700 },
                '& .MuiInputLabel-root': { color: 'text.secondary', fontSize: '0.9rem' },
                '& .MuiFormHelperText-root': { marginTop: 0 } } },
            elements: { [pointsEl.id]: pointsEl } };
        const pointsRowId = pointsCardId + "_row";
        const pointsRow = { id: pointsRowId, jsontype: "mui.stack",
            props: { direction: "row", spacing: 2, alignItems: "center" },
            elements: { [starId]: star, [pointsBoxId]: pointsBox } };
        const pointsCard = { id: pointsCardId, jsontype: "mui.box",
            props: { sx: { bgcolor: '#F4F5F7', borderRadius: 2, p: 2, mb: 2 } },
            elements: { [pointsRowId]: pointsRow } };

        // ---- Sections ------------------------------------------------------
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
        const address = { id: addressId, jsontype: "mui.box",
            props: { sx: { bgcolor: '#F4F5F7', borderRadius: 2, p: 2, mb: 2 } }, elements: {
            [addressId + "_t"]: sectionTitle(addressId, "Home Address"),
            [addressEl.id]: addressEl } };

        const cardsEl = viewUtils.buildUIElement(fid("cards"));
        const cardsId = root + "_cards";
        const cardsSec = { id: cardsId, jsontype: "mui.box",
            props: { sx: { bgcolor: '#F4F5F7', borderRadius: 2, p: 2, mb: 2 } }, elements: {
            [cardsId + "_t"]: sectionTitle(cardsId, "Cards"),
            [cardsEl.id]: cardsEl } };

        // Referral: kept mounted (required) but not shown.
        const refEl = viewUtils.buildUIElement(fid("referredBy"));
        const refMountId = root + "_refmount";
        const refMount = { id: refMountId, jsontype: "mui.box", elements: { [refEl.id]: refEl } };

        return { sx: { p: 2, maxWidth: 720, minWidth: 320, mx: 'auto' },
            elements: { [banner.id]: banner, [pointsCard.id]: pointsCard,
                        [identity.id]: identity, [address.id]: address, [cardsSec.id]: cardsSec,
                        [refMountId]: refMount } };
    } };
})();