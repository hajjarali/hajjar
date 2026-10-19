// EntityIdentifier — default form with an identity header (rules D1, D4, D5, D11, D12).
// The identifier is the title (mono), its type a soft chip; below, one Details row holds both inputs.
// An embedded bean has no id row of its own; it is drawn inside its legal entity's dialog.
(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    function typo(id, variant, children, sx) {
        const props = { variant: variant, children: children };
        if (sx) { props.sx = sx; }
        return { id: id, jsontype: "mui.typography", props: props };
    }
    // Every helper result is captured in a variable first and keyed by its own .id.
    function box(id, sx, children) {
        const els = {};
        for (let i = 0; i < children.length; i++) { els[children[i].id] = children[i]; }
        return { id: id, jsontype: "mui.box", props: { sx: sx }, elements: els };
    }
    function softChip(id, label, color) {
        return { id: id, jsontype: "ui.display.chip", props: { label: label, size: "small", variant: "soft", color: color || "primary" } };
    }
    function section(id, title, bodyChildren) {
        const t = typo(id + "_t", "overline", title, { fontWeight: 650, mb: 0.5 });
        const b = box(id + "_b", { border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }, bodyChildren);
        return box(id, { mt: 2 }, [t, b]);
    }

    // D1 — the identifier as the title, its type as a chip on the right.
    function header(rootId, identifier, type) {
        const id = rootId + "_head";
        const title = typo(id + "_t", "h6", identifier ? String(identifier) : "New identifier",
            { fontWeight: 700, fontFamily: "monospace", flex: 1, minWidth: 0 });
        const chipList = [];
        if (type) { chipList.push(softChip(id + "_k", String(type), "info")); }
        const chips = box(id + "_chips", { display: "flex", gap: 0.5 }, chipList);
        return box(id, { display: "flex", alignItems: "center", gap: 1.5, pb: 1.5, mb: 1, borderBottom: "1px solid", borderColor: "divider" }, [title, chips]);
    }

    // D5 — a value takes 8 of 12 columns, an enum 4.
    function details(rootId) {
        const id = rootId + "_det";
        const identifierEl = viewUtils.buildUIElement(model.fieldNameToModelId("identifier"));
        const typeEl = viewUtils.buildUIElement(model.fieldNameToModelId("identifierType"));
        const gi = { id: id + "_gi", jsontype: "mui.grid", props: { size: 8 }, elements: { [identifierEl.id]: identifierEl } };
        const gt = { id: id + "_gt", jsontype: "mui.grid", props: { size: 4 }, elements: { [typeEl.id]: typeEl } };
        const grid = { id: id + "_g", jsontype: "mui.grid", props: { container: true, columns: 12, spacing: 2, sx: { p: 2 } },
            elements: { [gi.id]: gi, [gt.id]: gt } };
        return section(id, "Details", [grid]);
    }

    return {
        main: function () {
            const rootId = model.getId() + "_root";
            const head = header(rootId, model.getFieldValue("identifier"), model.getFieldValue("identifierType"));
            const det = details(rootId);
            return {
                sx: { p: 2, maxWidth: 640, minWidth: 320, mx: "auto" },
                elements: {
                    [head.id]: head,
                    [det.id]: det
                }
            };
        }
    };
})();
