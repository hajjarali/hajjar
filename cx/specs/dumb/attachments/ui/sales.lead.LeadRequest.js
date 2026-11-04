(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    const beanViewUtils = require("cyai/beans/view/BeanViewUtils");
    function gridItem(el, size) {
        return { id: el.id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }
    function section(sectionId, title, items) {
        const children = {};
        for (const it of items) { children[it.id] = it; }
        const grid = { id: sectionId + "_in", jsontype: "mui.grid", props: { container: true, columns: 12, spacing: 2 }, elements: children };
        const frame = { id: sectionId + "_g", jsontype: "mui.box",
            props: { sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2 } }, elements: { [grid.id]: grid } };
        const heading = { id: sectionId + "_t", jsontype: "mui.typography",
            props: { variant: "subtitle2", children: title, sx: { fontSize: "0.75rem", fontWeight: 600, color: "text.secondary", mb: 0.5 } } };
        return { id: sectionId, jsontype: "mui.box", props: { sx: { mb: 2 } }, elements: { [heading.id]: heading, [frame.id]: frame } };
    }
    return { main: function () {
        const root = model.getId() + "_root";
        const idv = beanViewUtils.buildIdView(model.getId());
        const title = { id: root + "_title", jsontype: "mui.typography",
            props: { variant: "h5", children: "Lead request", sx: { fontWeight: 700, mb: 2 } } };
        const fullName = viewUtils.buildUIElement(model.fieldNameToModelId("fullName"));
        const email = viewUtils.buildUIElement(model.fieldNameToModelId("email"));
        const phone = viewUtils.buildUIElement(model.fieldNameToModelId("phone"));
        const requestType = viewUtils.buildUIElement(model.fieldNameToModelId("requestType"));
        const status = viewUtils.buildUIElement(model.fieldNameToModelId("status"));
        const preferredModel = viewUtils.buildUIElement(model.fieldNameToModelId("preferredModel"));
        const message = viewUtils.buildUIElement(model.fieldNameToModelId("message"));
        const contact = section(root + "_c", "Contact", [gridItem(fullName, 6), gridItem(email, 6), gridItem(phone, 6)]);
        const request = section(root + "_r", "Request", [gridItem(requestType, 6), gridItem(status, 6), gridItem(preferredModel, 6), gridItem(message, 12)]);
        return { sx: { p: 2, maxWidth: 720, minWidth: 320, mx: "auto" }, elements: {
            [idv.idRow.id]: idv.idRow, [title.id]: title, [contact.id]: contact, [request.id]: request } };
    } };
})();