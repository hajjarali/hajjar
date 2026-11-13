(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    const beanViewUtils = require("cyai/beans/view/BeanViewUtils");
    function gridItem(el, size) {
        return { id: el.id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }
    return { main: function () {
        const root = model.getId() + "_root";
        const idv = beanViewUtils.buildIdView(model.getId());
        const title = gridItem(viewUtils.buildUIElement(model.fieldNameToModelId("title")), 12);
        const author = gridItem(viewUtils.buildUIElement(model.fieldNameToModelId("author")), 12);
        const rating = gridItem(viewUtils.buildUIElement(model.fieldNameToModelId("rating")), 6);
        const read = gridItem(viewUtils.buildUIElement(model.fieldNameToModelId("read")), 6);
        const details = { id: root + "_dg", jsontype: "mui.grid", props: { container: true, columns: 12, spacing: 2 },
            elements: { [title.id]: title, [author.id]: author, [rating.id]: rating, [read.id]: read } };
        const box = { id: root + "_box", jsontype: "mui.box",
            props: { sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2 } },
            elements: { [details.id]: details } };
        const label = { id: root + "_t", jsontype: "mui.typography",
            props: { variant: "subtitle2", children: "Book",
                     sx: { textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 600, color: "text.secondary", mb: 0.5 } } };
        const section = { id: root + "_s", jsontype: "mui.box", props: { sx: { mb: 2 } },
            elements: { [label.id]: label, [box.id]: box } };
        return { sx: { p: 2, maxWidth: 720, minWidth: 300, mx: "auto" },
                 elements: { [idv.idRow.id]: idv.idRow, [section.id]: section } };
    } };
})();