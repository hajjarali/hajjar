(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    const beanViewUtils = require("cyai/beans/view/BeanViewUtils");

    function detailRow(rowId, label, fieldId) {
        const field = viewUtils.buildUIElement(fieldId);
        const labelEl = { id: rowId + "_l", jsontype: "mui.typography",
            props: { variant: "body2", children: label, sx: { color: "text.secondary", width: 160, flexShrink: 0, textTransform: "none", pt: 1 } } };
        const valueBox = { id: rowId + "_v", jsontype: "mui.box", props: { sx: { flex: 1, minWidth: 0 } },
            elements: { [field.id]: field } };
        return { id: rowId, jsontype: "mui.box",
            props: { sx: { display: "flex", alignItems: "flex-start", gap: 2, py: 1, borderBottom: "1px solid", borderColor: "divider" } },
            elements: { [labelEl.id]: labelEl, [valueBox.id]: valueBox } };
    }

    return { main: function () {
        const root = model.getId() + "_root";
        const fid = function (n) { return model.fieldNameToModelId(n); };

        const nameVal = model.getFieldValue("name");
        const floorVal = model.getFieldValue("floor");
        const capVal = model.getFieldValue("capacity");
        const title = (nameVal === null || nameVal === undefined || String(nameVal) === "") ? "New room" : String(nameVal);
        const parts = [];
        if (floorVal !== null && floorVal !== undefined) { parts.push("Floor " + String(floorVal)); }
        if (capVal !== null && capVal !== undefined) { parts.push(String(capVal) + " seats"); }

        const titleEl = { id: root + "_title", jsontype: "mui.typography",
            props: { variant: "h4", children: title, sx: { fontWeight: 700, textTransform: "none" } } };
        const subEl = { id: root + "_sub", jsontype: "mui.typography",
            props: { variant: "body1", children: parts.join(" \u00b7 "), sx: { color: "text.secondary", textTransform: "none" } } };
        const header = { id: root + "_header", jsontype: "mui.box", props: { sx: { mb: 3 } },
            elements: { [titleEl.id]: titleEl, [subEl.id]: subEl } };

        const rows = { id: root + "_rows", jsontype: "mui.box", props: { sx: { borderTop: "1px solid", borderColor: "divider" } },
            elements: {} };
        const r1 = detailRow(root + "_r_name", "Name", fid("name"));
        const r2 = detailRow(root + "_r_floor", "Floor", fid("floor"));
        const r3 = detailRow(root + "_r_cap", "Capacity", fid("capacity"));
        const r4 = detailRow(root + "_r_eq", "Equipment", fid("equipment"));
        rows.elements[r1.id] = r1;
        rows.elements[r2.id] = r2;
        rows.elements[r3.id] = r3;
        rows.elements[r4.id] = r4;

        return { sx: { p: 4, maxWidth: 720, minWidth: 320, mx: "auto" },
            elements: { [header.id]: header, [rows.id]: rows } };
    } };
})();
