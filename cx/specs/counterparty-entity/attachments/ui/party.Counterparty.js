(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    function gridField(id, size, label, helper) {
        const props = { label: label, variant: "outlined", size: "small" };
        if (helper) { props.helperText = helper; }
        const el = viewUtils.buildUIElement(id, props);
        return { id: id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }

    function section(sectionId, title, items) {
        const grid = sectionId + "_g"; const children = {};
        for (const it of items) { children[it.id] = it; }
        return { id: sectionId, jsontype: "mui.box", props: { sx: { mb: 1 } }, elements: {
            [sectionId + "_t"]: { id: sectionId + "_t", jsontype: "mui.typography",
                props: { variant: "subtitle2", children: title,
                         sx: { textTransform: 'none', fontSize: '0.7rem', fontWeight: 600, color: 'text.secondary', mb: 0.25 } } },
            [grid]: { id: grid, jsontype: "mui.box",
                props: { sx: { border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1.5 } },
                elements: { [grid + "_in"]: { id: grid + "_in", jsontype: "mui.grid",
                    props: { container: true, columns: 12, spacing: 1.5 }, elements: children } } } } };
    }

    function panel(accordionId, title, inner, expanded) {
        const sumId = accordionId + "_sum";
        const detId = accordionId + "_det";
        const innerId = accordionId + "_in";
        // The expand arrows. `expandIcon` cannot carry a component descriptor in a dynamic
        // tree, so the pair is drawn as sibling icons: expandMore visible when collapsed,
        // expandLess when expanded; the summary's click flips both, tracking the accordion.
        const moreId = accordionId + "_more";
        const lessId = accordionId + "_less";
        const more = { id: moreId, jsontype: "mui.icon",
            props: { children: "expandMore", sx: { color: 'text.secondary' } } };
        const less = { id: lessId, jsontype: "mui.icon", hidden: !expanded,
            props: { children: "expandLess", sx: { color: 'text.secondary' } } };
        const titleId = sumId + "_t";
        const titleEl = { id: titleId, jsontype: "mui.typography",
            props: { variant: "subtitle2", children: title,
                     sx: { textTransform: 'none', fontWeight: 600, flex: 1 } } };
        const sum = { id: sumId, jsontype: "mui.accordionsummary",
            props: { sx: { minHeight: 40 } },
            actions: viewUtils.actions(viewUtils.onClick([
                viewUtils.toggleVisibility(moreId),
                viewUtils.toggleVisibility(lessId)
            ])),
            elements: { [titleId]: titleEl, [moreId]: more, [lessId]: less } };
        return { id: accordionId, jsontype: "mui.accordion", props: { defaultExpanded: expanded, disableGutters: true },
            elements: {
                [sumId]: sum,
                [detId]: { id: detId, jsontype: "mui.accordiondetails",
                    props: { sx: { pt: 0 } },
                    elements: { [innerId]: { id: innerId, jsontype: "mui.box", elements: inner } } }
            } };
    }

    return { main: function () {
        const root = model.getId() + "_root";
        const fid = (n) => model.fieldNameToModelId(n);

        // Header band: the name carries the row, the status sits beside it.
        const nameF = gridField(fid("legalName"), 8, "Legal Name");
        const statusF = gridField(fid("status"), 4, "Status");
        const headerId = root + "_header";
        const header = { id: headerId, jsontype: "mui.box",
            props: { sx: { pb: 1, mb: 1, borderBottom: '1px solid', borderColor: 'divider' } },
            elements: { [headerId + "_g"]: { id: headerId + "_g", jsontype: "mui.grid",
                props: { container: true, columns: 12, spacing: 1.5 },
                elements: { [nameF.id]: nameF, [statusF.id]: statusF } } } };

        const basic = section(root + "_basic", "Basic Info", [
            gridField(fid("shortCode"), 6, "Short Code", "Immutable once set."),
            gridField(fid("type"), 6, "Type"),
            gridField(fid("parent"), 12, "Parent")
        ]);
        const money = section(root + "_money", "Money", [
            gridField(fid("creditLimit"), 6, "Credit Limit"),
            gridField(fid("onboardedOn"), 6, "Onboarded On"),
            gridField(fid("sanctionsScreened"), 12, "Sanctions Screened")
        ]);
        const notes = section(root + "_notes", "Notes", [
            gridField(fid("notes"), 12, "Notes")
        ]);
        const addrFieldId = fid("registeredAddress");
        const addrEl = viewUtils.buildUIElement(addrFieldId, {});
        const address = section(root + "_address", "Registered Address", [
            { id: addrFieldId + "_gi", jsontype: "mui.grid", props: { size: 12 }, elements: { [addrEl.id]: addrEl } }
        ]);
        const contactsFieldId = fid("contacts");
        const contactsEl = viewUtils.buildUIElement(contactsFieldId, {});
        const contacts = section(root + "_contacts", "Contacts", [
            { id: contactsFieldId + "_gi", jsontype: "mui.grid", props: { size: 12 }, elements: { [contactsEl.id]: contactsEl } }
        ]);

        // Collapsible panels — every field stays mounted (hidden containers around entity
        // fields are refused), so this is the compact equivalent of tabs.
        const pOverview = panel(root + "_p_overview", "Overview",
            { [basic.id]: basic, [money.id]: money, [notes.id]: notes }, true);
        const pAddress = panel(root + "_p_address", "Address",
            { [address.id]: address }, false);
        const pContacts = panel(root + "_p_contacts", "Contacts",
            { [contacts.id]: contacts }, false);

        return { sx: { p: 1.5, maxWidth: 900, mx: 'auto', minWidth: 320 }, elements: {
            [header.id]: header,
            [pOverview.id]: pOverview,
            [pAddress.id]: pAddress,
            [pContacts.id]: pContacts
        } };
    } };
})();