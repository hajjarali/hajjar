(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    const beanViewUtils = require("cyai/beans/view/BeanViewUtils");
    function gridItem(el, size) {
        return { id: el.id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }
    function section(sectionId, title, items) {
        const grid = sectionId + "_g";
        const children = {};
        for (const it of items) { children[it.id] = it; }
        return { id: sectionId, jsontype: "mui.box", props: { sx: { mb: 2 } }, elements: {
            [sectionId + "_t"]: { id: sectionId + "_t", jsontype: "mui.typography",
                props: { variant: "subtitle2", children: title,
                         sx: { textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 600, color: "text.secondary", mb: 0.5 } } },
            [grid]: { id: grid, jsontype: "mui.box",
                props: { sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2 } },
                elements: { [grid + "_in"]: { id: grid + "_in", jsontype: "mui.grid",
                    props: { container: true, columns: 12, spacing: 2 }, elements: children } } } } };
    }
    return { main: function () {
        const root = model.getId() + "_root";
        const idv = beanViewUtils.buildIdView(model.getId());
        const header = { id: root + "_hdr", jsontype: "mui.typography",
            props: { variant: "h6", children: "Customer note", sx: { fontWeight: 700, mb: 2 } } };
        const nameEl = viewUtils.buildUIElement(model.fieldNameToModelId("customerName"));
        const dateEl = viewUtils.buildUIElement(model.fieldNameToModelId("createdDate"));
        const textEl = viewUtils.buildUIElement(model.fieldNameToModelId("noteText"));
        const identity = section(root + "_who", "Customer", [gridItem(nameEl, 6), gridItem(dateEl, 3)]);
        const body = section(root + "_body", "Note", [gridItem(textEl, 12)]);
        return { sx: { p: 2, maxWidth: 720, minWidth: 320, mx: "auto" }, elements: {
            [idv.idRow.id]: idv.idRow,
            [header.id]: header,
            [identity.id]: identity,
            [body.id]: body
        } };
    } };
})();