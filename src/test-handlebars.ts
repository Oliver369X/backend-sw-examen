import * as Handlebars from 'handlebars';

// Register helpers
Handlebars.registerHelper('eq', function(a: any, b: any) {
  return a === b;
});

Handlebars.registerHelper('capitalize', function(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

const templateSource = `
{{#each attributes}}
{{#unless (eq name "id")}}
{{#if (eq type "String")}}
{{#if (eq name "email")}}
if ({{entityName}}DTO.get{{capitalize name}}() != null) {
  // Email validation for {{entityName}}
}
{{/if}}
{{/if}}
{{/unless}}
{{/each}}
`;

const template = Handlebars.compile(templateSource);

const data = {
  entityName: 'user',
  attributes: [
    { name: 'id', type: 'Long' },
    { name: 'email', type: 'String' },
    { name: 'password', type: 'String' }
  ]
};

console.log('Template output:');
console.log(template(data));
