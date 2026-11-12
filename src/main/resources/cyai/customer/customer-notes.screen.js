// Customer notes screen — built from the spec mock ui/customer-notes.screen.js, region for region:
// a table region (the platform's standard data table, with Open / Delete) beside a side panel
// (the selected note's default form, with Save / Cancel).
(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    return { main: function () {
        const root = model.getId() + "_root";

        const tableEl = viewUtils.buildUIElement(model.getTable().getId());
        const openBtn = viewUtils.buildUIElement(model.getOpenButton().getId());
        const delBtn = viewUtils.buildUIElement(model.getDeleteButton().getId());
        const tableActions = { id: root + "_table_actions", jsontype: "mui.stack",
            props: { direction: "row", spacing: 1, sx: { mb: 1 } },
            elements: { [openBtn.id]: openBtn, [delBtn.id]: delBtn } };
        const tableBox = { id: root + "_table_box", jsontype: "mui.box",
            props: { sx: { flex: 1, minHeight: 0, minWidth: 0 } },
            elements: { [tableEl.id]: tableEl } };
        const tableRegion = { id: root + "_table_region", jsontype: "mui.box",
            props: { sx: { flex: 2, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 } },
            elements: { [tableActions.id]: tableActions, [tableBox.id]: tableBox } };

        const title = { id: root + "_panel_title", jsontype: "mui.typography",
            props: { variant: "subtitle2", children: "Selected note", sx: { mb: 1 } } };
        const panelEls = {};
        panelEls[title.id] = title;
        const formId = model.getFormId();
        if (viewUtils.hasElement(formId)) {
            const formEl = viewUtils.buildUIElement(formId);
            panelEls[formEl.id] = formEl;
        } else {
            const hint = { id: root + "_panel_hint", jsontype: "mui.typography",
                props: { variant: "body2", color: "text.secondary", children: "Select a note to see it here." } };
            panelEls[hint.id] = hint;
        }
        const saveBtn = viewUtils.buildUIElement(model.getSaveButton().getId());
        const cancelBtn = viewUtils.buildUIElement(model.getCancelButton().getId());
        const panelActions = { id: root + "_panel_actions", jsontype: "mui.stack",
            props: { direction: "row", spacing: 1, sx: { mt: 1 } },
            elements: { [saveBtn.id]: saveBtn, [cancelBtn.id]: cancelBtn } };
        panelEls[panelActions.id] = panelActions;
        const panel = { id: root + "_panel", jsontype: "mui.paper",
            props: { variant: "outlined", sx: { flex: 1, p: 2, overflowY: "auto", minWidth: 0 } },
            elements: panelEls };

        const split = { id: root + "_split", jsontype: "mui.box",
            props: { sx: { display: "flex", flexDirection: "row", gap: 2, flex: 1, minHeight: 0 } },
            elements: { [tableRegion.id]: tableRegion, [panel.id]: panel } };
        return { sx: { height: "100%", overflow: "hidden" }, elements: {
            [root]: { id: root, jsontype: "mui.box",
                props: { sx: { height: "100%", width: "100%", display: "flex", flexDirection: "column", p: 2 } },
                elements: { [split.id]: split } } } };
    } };
})();
