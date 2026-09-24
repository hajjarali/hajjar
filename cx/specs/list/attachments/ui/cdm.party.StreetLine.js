(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    return { main: function () {
        const fid = (n) => model.fieldNameToModelId(n);
        const el = viewUtils.buildUIElement(fid("value"));
        return { sx: { minWidth: 200 }, elements: { [el.id]: el } };
    } };
})();