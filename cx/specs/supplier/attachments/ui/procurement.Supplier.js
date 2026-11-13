(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    const beanViewUtils = require("cyai/beans/view/BeanViewUtils");
    function gridField(id, size) {
        const el = viewUtils.buildUIElement(id);
        return { id: id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }
    return { main: function () {
        const root = model.getId() + "_root";
        const fid = function (n) { return model.fieldNameToModelId(n); };
        const idv = beanViewUtils.buildIdView(model.getId());
        const nameValue = model.getFieldValue("name");
        const title = {
            id: root + "_title", jsontype: "mui.typography",
            props: { variant: "h5", children: nameValue ? nameValue : "New supplier", sx: { fontWeight: 700, mb: 2 } }
        };
        const gridId = root + "_details_g";
        const items = {};
        const f1 = gridField(fid("name"), 6);
        const f2 = gridField(fid("active"), 3);
        const f3 = gridField(fid("contactEmail"), 6);
        const f4 = gridField(fid("country"), 6);
        items[f1.id] = f1; items[f2.id] = f2; items[f3.id] = f3; items[f4.id] = f4;
        const details = {
            id: root + "_details", jsontype: "mui.box", props: { sx: { mb: 2 } }, elements: {
                [root + "_details_t"]: { id: root + "_details_t", jsontype: "mui.typography",
                    props: { variant: "subtitle2", children: "Details",
                             sx: { textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 600, color: "text.secondary", mb: 0.5 } } },
                [gridId]: { id: gridId, jsontype: "mui.box",
                    props: { sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2 } },
                    elements: { [gridId + "_in"]: { id: gridId + "_in", jsontype: "mui.grid",
                        props: { container: true, columns: 12, spacing: 2 }, elements: items } } }
            }
        };
        return { sx: { p: 2, maxWidth: 720, minWidth: 320, mx: "auto" },
                 elements: { [idv.idRow.id]: idv.idRow, [title.id]: title, [details.id]: details } };
    } };
})();