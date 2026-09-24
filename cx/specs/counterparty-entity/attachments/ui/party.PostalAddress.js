(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    function gridField(id, size, label) {
        const el = viewUtils.buildUIElement(id, { label: label, variant: "outlined" });
        return { id: id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }

    return { main: function () {
        const root = model.getId() + "_root";
        const fid = (n) => model.fieldNameToModelId(n);
        const street = gridField(fid("line1"), 12, "Street");
        const city = gridField(fid("city"), 6, "City");
        const country = gridField(fid("country"), 6, "Country");
        const gridId = root + "_g";
        return { sx: { p: 1 }, elements: {
            [gridId]: { id: gridId, jsontype: "mui.grid",
                props: { container: true, columns: 12, spacing: 2 },
                elements: {
                    [street.id]: street,
                    [city.id]: city,
                    [country.id]: country
                } }
        } };
    } };
})();