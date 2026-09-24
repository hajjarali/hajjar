(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    function gridField(id, size, label, helper) {
        const props = { label: label, variant: "outlined" };
        if (helper) { props.helperText = helper; }
        const el = viewUtils.buildUIElement(id, props);
        return { id: id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }

    function section(sectionId, title, helper, items) {
        const grid = sectionId + "_g";
        const children = {};
        for (const it of items) { children[it.id] = it; }
        const head = { id: sectionId + "_t", jsontype: "mui.typography",
            props: { variant: "subtitle2", children: title,
                     sx: { textTransform: 'uppercase', letterSpacing: '0.08em',
                           fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary' } } };
        const elements = { [head.id]: head };
        if (helper) {
            const h = { id: sectionId + "_h", jsontype: "mui.typography",
                props: { variant: "caption", children: helper,
                         sx: { textTransform: 'none', display: 'block', color: 'text.secondary', mt: 0.5, mb: 1.5 } } };
            elements[h.id] = h;
        }
        elements[grid] = { id: grid, jsontype: "mui.paper",
            props: { elevation: 0,
                     sx: { border: '1px solid', borderColor: 'divider',
                           borderRadius: 2, p: 2.5, bgcolor: 'background.paper' } },
            elements: { [grid + "_in"]: { id: grid + "_in", jsontype: "mui.grid",
                props: { container: true, columns: 12, spacing: 2.5 }, elements: children } } };
        return { id: sectionId, jsontype: "mui.box", props: { sx: { mb: 3 } }, elements: elements };
    }

    function cdmLogoSvg() {
        const hexagon = "M 28 8 L 45.32 18 L 45.32 38 L 28 48 L 10.68 38 L 10.68 18 Z";
        const arc = "M 34.89 22.21 A 9 9 0 1 0 34.89 33.79";
        const dots = [[28, 8], [45.32, 18], [45.32, 38], [28, 48], [10.68, 38], [10.68, 18]]
            .map(function (p) {
                return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2" fill="currentColor"/>';
            }).join("");
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 56" role="img" aria-label="CDM logo">'
            + '<path d="' + hexagon + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" opacity="0.85"/>'
            + '<path d="' + arc + '" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>'
            + dots
            + '<text x="60" y="37" font-family="sans-serif" font-size="24" font-weight="700" letter-spacing="3" fill="currentColor">CDM</text>'
            + '</svg>';
    }

    return { main: function () {
        const root = model.getId() + "_root";
        const fid = (n) => model.fieldNameToModelId(n);

        const logoBox = root + "_logo";
        const logoSvg = logoBox + "_svg";
        const logo = { id: logoBox, jsontype: "mui.box",
            props: { sx: { display: 'flex', justifyContent: 'center', mb: 1.5 } },
            elements: { [logoSvg]: { id: logoSvg, jsontype: "ui.svg",
                props: { svg: cdmLogoSvg(), sx: { width: 200 } } } } };
        const logoRule = { id: root + "_logorule", jsontype: "mui.divider",
            props: { sx: { mb: 3 } } };

        const basics = section(root + "_b", "Legal Entity", null, [
            gridField(fid("name"), 12, "Name", "The legal entity's official name.")
        ]);

        const identifiers = section(root + "_i", "Entity Identifiers",
            "One or more identifiers. An LEI is exactly 20 alphanumeric characters.", [
            gridField(fid("entityIdentifier"), 12, "Identifiers", null)
        ]);

        return { sx: { p: 3, minWidth: 360, maxWidth: 720, mx: 'auto', bgcolor: 'background.default' },
                 elements: { [logo.id]: logo, [logoRule.id]: logoRule,
                             [basics.id]: basics, [identifiers.id]: identifiers } };
    } };
})();