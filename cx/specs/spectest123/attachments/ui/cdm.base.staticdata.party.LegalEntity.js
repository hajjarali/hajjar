// LegalEntity — default form, minimal object page (rules D1, D4, D5, D11, D12, D14 of default-form-design).
// A two-field bean still gets a real shape: the header names the entity (monogram, name as the title, the LEI
// as a mono fact, History / Audit links), and Details edits the name and the LEI in one row.
// The Save / Save and close / Close footer is the hosting form pane's own row (D15), not drawn by this file.
(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    const beanViewUtils = require("cyai/beans/view/BeanViewUtils");

    function typo(id, variant, children, sx) {
        const props = { variant: variant, children: children };
        if (sx) { props.sx = sx; }
        return { id: id, jsontype: "mui.typography", props: props };
    }
    function box(id, sx, els) { return { id: id, jsontype: "mui.box", props: { sx: sx }, elements: els || {} }; }

    function initialsOf(name) {
        const words = String(name || "").split(" ").filter(function (w) { return w && /^[A-Za-z]/.test(w); });
        const first = words.length ? words[0].charAt(0) : "?";
        const second = words.length > 1 ? words[1].charAt(0) : "";
        return (first + second).toUpperCase();
    }

    // D1 + D14 — monogram, the name as the title, the LEI as a mono fact; the history links on the right.
    function header(rootId, name, lei) {
        const id = rootId + "_head";
        const fact = lei
            ? box(id + "_fact", { display: "flex", alignItems: "center", gap: 0.75, mt: 0.25 }, {
                [id + "_ft"]: typo(id + "_ft", "caption", "LEI", { color: "text.secondary", fontWeight: 650, textTransform: "none" }),
                [id + "_fv"]: typo(id + "_fv", "body2", String(lei), { fontFamily: "monospace", color: "text.primary" })
            })
            : typo(id + "_fact", "body2", "No LEI yet", { color: "text.disabled", fontStyle: "italic", mt: 0.25 });
        return box(id, { display: "flex", alignItems: "center", gap: 1.75, pb: 1.75, mb: 2, borderBottom: "1px solid", borderColor: "divider" }, {
            [id + "_av"]: { id: id + "_av", jsontype: "mui.avatar", props: { variant: "rounded", children: initialsOf(name),
                sx: { width: 48, height: 48, borderRadius: 2, bgcolor: "primary.main", color: "common.white", fontWeight: 700, fontSize: 18 } } },
            [id + "_txt"]: box(id + "_txt", { minWidth: 0, flex: 1 }, {
                [id + "_t"]: typo(id + "_t", "h5", name || "New legal entity", { fontWeight: 700, lineHeight: 1.2 }),
                [fact.id]: fact
            }),
            [id + "_links"]: box(id + "_links", { display: "flex", gap: 1.5 }, {
                [id + "_hist"]: typo(id + "_hist", "caption", "History", { color: "primary.main", cursor: "pointer", textTransform: "none" }),
                [id + "_aud"]: typo(id + "_aud", "caption", "Audit", { color: "primary.main", cursor: "pointer", textTransform: "none" })
            })
        });
    }

    // D3 + D12 — an overline title over one outlined box.
    function section(id, title, bodyEls) {
        return box(id, { mt: 2 }, {
            [id + "_t"]: typo(id + "_t", "overline", title, { fontWeight: 650 }),
            [id + "_b"]: box(id + "_b", { border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }, bodyEls)
        });
    }

    // D4 + D5 — both fields required; the name is a short text (6 of 12), the LEI a code (3 of 12), one row.
    function details(rootId) {
        const id = rootId + "_det";
        const nameEl = viewUtils.buildUIElement(model.fieldNameToModelId("name"));
        const leiEl = viewUtils.buildUIElement(model.fieldNameToModelId("lei"));
        const grid = { id: id + "_g", jsontype: "mui.grid", props: { container: true, columns: 12, spacing: 2, sx: { p: 2 } }, elements: {
            [id + "_gn"]: { id: id + "_gn", jsontype: "mui.grid", props: { size: 6 }, elements: { [nameEl.id]: nameEl } },
            [id + "_gl"]: { id: id + "_gl", jsontype: "mui.grid", props: { size: 3 }, elements: { [leiEl.id]: leiEl } }
        } };
        return section(id, "Details", { [grid.id]: grid });
    }

    return {
        main: function () {
            const rootId = model.getId() + "_root";
            const head = header(rootId, model.getFieldValue("name"), model.getFieldValue("lei"));
            const det = details(rootId);
            const idv = beanViewUtils.buildIdView(model.getId());
            return {
                sx: { p: 2, maxWidth: 960, minWidth: 360, mx: "auto" },
                elements: {
                    [head.id]: head,
                    [det.id]: det,
                    [idv.idRow.id]: idv.idRow
                }
            };
        }
    };
})();