(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    function gridField(id, size, label) {
        const el = viewUtils.buildUIElement(id, { label: label, variant: "outlined" });
        return { id: el.id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }

    function embedItem(fieldId) {
        const el = viewUtils.buildUIElement(fieldId);
        return { id: el.id + "_gi", jsontype: "mui.grid", props: { size: 12 }, elements: { [el.id]: el } };
    }

    function section(sectionId, title, items) {
        const inner = sectionId + "_in"; const children = {};
        for (const it of items) { children[it.id] = it; }
        return { id: sectionId, jsontype: "mui.box", props: { sx: { mb: 2 } }, elements: {
            [sectionId + "_t"]: { id: sectionId + "_t", jsontype: "mui.typography",
                props: { variant: "subtitle2", children: title,
                         sx: { textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 600, color: "text.secondary", mb: 0.5 } } },
            [sectionId + "_b"]: { id: sectionId + "_b", jsontype: "mui.box",
                props: { sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2 } },
                elements: { [inner]: { id: inner, jsontype: "mui.grid",
                    props: { container: true, columns: 12, spacing: 2 }, elements: children } } } } };
    }

    return { main: function () {
        const root = model.getId() + "_root";
        const fid = (n) => model.fieldNameToModelId(n);
        const phones = section(root + "_phones", "Telephone", [ embedItem(fid("telephone")) ]);
        const addresses = section(root + "_addresses", "Addresses", [ embedItem(fid("address")) ]);
        const emails = section(root + "_emails", "Emails", [ embedItem(fid("email")) ]);
        const pages = section(root + "_pages", "Web Page", [ gridField(fid("webPage"), 12, "Web Page") ]);
        const elements = {};
        elements[phones.id] = phones;
        elements[addresses.id] = addresses;
        elements[emails.id] = emails;
        elements[pages.id] = pages;
        return { sx: { p: 2, minWidth: 320 }, elements: elements };
    } };
})();