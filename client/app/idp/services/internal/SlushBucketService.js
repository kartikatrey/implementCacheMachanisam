//created new service for preparing data for slushbucket
export default class SlushBucketService {
    //method to prepare data for slushbucket
    static prepareSlushbucketFieldsData(allFieldData, selectedFieldData) {
        if (!allFieldData || !allFieldData.length) {
            return;
        }
        const allFields = {
            source: [],
            destination: [],
        };
        //preparing fields which are necessary for duallistbox component
        const prepareBucketField = (field) => {
            return {
                id: field.id,
                label: field.label,
                name:(field.value || field.name),
                order: !isNaN(field.order) ? field.order : 9999,
                code: field.value
            };
        };
        //method to check if field is in selected list or not
        const isSelectedField = (field) => {
            return selectedFieldData.find(item => item.label == field.label);
        };
        //preparing object with "source and destination" keys to differentiate between fields (which would be either in source or in destination)
        const addField = (field) => {
            if (!field) {
                return;
            }
            let selectedField=isSelectedField(field)
            const fieldKey = selectedField ? "destination" : "source";
            if(selectedField && selectedField.order){
                field.order=selectedField.order
            }
            allFields[fieldKey].push(prepareBucketField(field));
        };
        allFieldData.map(addField);
        allFields.destination.sort((a, b) => a.order - b.order);
        allFields.source.sort((a, b) => a.order - b.order);
        return allFields;
    }
}
