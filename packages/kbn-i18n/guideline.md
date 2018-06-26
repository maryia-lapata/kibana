# I18n Guideline

## For Vendors

#### Message types

Each message id ends with a descriptive type.
<br>
The following types are supported:
- header
- label
- button
- dropDown
- placeholder
- tooltip
- aria
- errorMessage
- toggleSwitch

There is one more complex case, when we have to divide a single expression into different labels. For example the message before translation likes like:

  ```js
  <p>
    The following deprecated languages are in use: {deprecatedLangsInUse.join(', ')}. Support for these languages will be removed in the next major version of Kibana and Elasticsearch. Convert you scripted fields to <EuiLink href={painlessDocLink}>Painless</EuiLink> to avoid any problems.
  </p>
  ```

This phrase contains a variable languages list and a link (``Painless``). For such cases we divide the message into two parts: the main message, which contains placeholders, and additioanl message, which represents inner meesage.
<br>
It is used the following id naming structure:
1) the main message id has the type on the second-to-last position, thereby identifying a divided phrase, and the last segment ``detail``.
```js
“kbn.management.indexPattern.edit.scripted.deprecationLang.label.detail”: "The following deprecated languages are in use: {deprecatedLangsInUse}. Support for these languages will be removed in the next major version of Kibana and Elasticsearch. Convert you scripted fields to {link} to avoid any problems."
```
2) the inner message id has the type on the second-to-last position and the name of the variable from the placeholder in the main message (in this case ``link``) as the last segment.
```js

“kbn.management.indexPattern.edit.scripted.deprecationLang.label.link”: “Painless”
```

#### Placeholders

Messages can contain placeholders for embedding a value of a variable. For example:
```js
"kbn.management.indexPattern.edit.scripted.deleteField.label": "Delete scripted field '{fieldName}'?"
"kbn.management.indexPattern.edit.scripted.noField.label": "'{indexPatternTitle}' index pattern doesn't have a scripted field called '{fieldName}'"
```
Mostly such placeholders has meaningful name according to the ontent.

## Best practices


#### Naming conversation

- Message id should start from namespace. For example:

  ```js
  "kbn.management.indexPattern.create.stepTime.options.pattern.header"
  "common.ui.indexPattern.create.warning.label"
  ```

- Use camelCase for naming segments.

- Each message id should end with a type. For example:

  ```js
  “kbn.management.indexPattern.edit.createIndex.button”
  “kbn.management.indexPattern.edit.mappingConflict.header”
  “kbn.management.indexPattern.edit.mappingConflict.label”
  “kbn.management.indexPattern.edit.fields.filter.aria”
  “kbn.management.indexPattern.edit.fields.filter.placeholder”
  “kbn.management.indexPattern.edit.refresh.tooltip”
  “kbn.management.indexPattern.edit.fields.allTypes.dropDown”
  “kbn.management.indexPattern.create.includeSystemIndices.toggleSwitch”
  “kbn.management.indexPattern.edit.wrongType.errorMessage”
  “kbn.management.indexPattern.edit.scripted.table.name.description”
  ```

- For complex messagges, that is divided into several, use the folllowing approach:
  - the main message id should have the type on the second-to-last position, thereby identifying a divided phrase, and the last segment should be ``detail``,
  - the inner message id should have the type on the second-to-last position and the name of the variable from the placeholder in the main message as the last segment.

  For example before the translation there was a message:
  ```js
  <strong>Success!</strong>
  Your index pattern matches <strong>{exactMatchedIndices.length} {exactMatchedIndices.length > 1 ? 'indices' : 'index'}</strong>.
  ```

  After translation:
  ```js
  <FormattedMessage
    id="kbn.management.indexPattern.create.step.status.success.label.detail"
    defaultMessage="{strongSuccess} Your index pattern matches {strongIndices}."
    values={{
      strongSuccess: (
        <strong>
          <FormattedMessage
            id="kbn.management.indexPattern.create.step.status.success.label.strongSuccess"
            defaultMessage="Success!"
          />
        </strong>),
      strongIndices: (
        <strong>
          <FormattedMessage
            id="kbn.management.indexPattern.create.step.status.success.label.strongIndices"
            defaultMessage="{indicesLength, plural, one {# index} other {# indices}}"
            values={{ indicesLength: exactMatchedIndices.length }}
          />
        </strong>)
    }}
  />
  ```


#### Define type for message

Each message id should ends with a type of the message. For example

- for header:

  ```js
  <h1>
      <FormattedMessage
        id="kbn.management.indexPattern.create.header"
        defaultMessage="Create index pattern"
      />
  </h1>
  ```

- for label:

  ```js
  <EuiTextColor color="subdued">
      <FormattedMessage
        id="kbn.management.indexPattern.create.label"
        defaultMessage="Kibana uses index patterns to retrieve data from Elasticsearch indices for things like visualizations."
      />
  </EuiTextColor>
  ```

- for button:

  ```js

  <EuiButton data-test-subj="addScriptedFieldLink" href={addScriptedFieldUrl}>
       <FormattedMessage id="kbn.management.indexPattern.edit.scripted.addField.button" defaultMessage="Add scripted field"/>
  </EuiButton>
  ```

- for dropDown:

  ```js
  <select ng-model="indexedFieldTypeFilter" ng-options="o for o in indexedFieldTypes">
      <option value=""
          i18n-id="kbn.management.indexPattern.edit.fields.allTypes.dropDown"
          i18n-default-message="All field types"></option>
  </select>
  ```

- for placeholder:

  ```js
  <EuiFieldText
      name="indexPatternId"
      placeholder={intl.formatMessage({
        id: 'kbn.management.indexPattern.create.stepTime.options.pattern.placeholder',
        defaultMessage: 'custom-index-pattern-id' })}
  />
  ```

- for `aria-label` attribute and tooltip

  ```js
  <button
      aria-label="{{'kbn.management.indexPattern.edit.remove.aria' | i18n: {defaultMessage: 'Remove index pattern'} }}"
      tooltip="{{'kbn.management.indexPattern.edit.remove.tooltip' | i18n: {defaultMessage: 'Remove index pattern'} }}"
      >
  </button>
  ```

- for errorMessage:

  ```js
  errors.push(
      intl.formatMessage(
              {
                  id: 'kbn.management.indexPattern.create.step.invalidCharacters.errorMessage',
                  defaultMessage: 'An index pattern cannot contain spaces or the characters: {characterList}'
              },
              { characterList }
      ));
  ```

- for toggleSwitch

  ```js
  <EuiSwitch
      label={<FormattedMessage
        id="kbn.management.indexPattern.create.includeSystemIndices.toggleSwitch"
        defaultMessage="Include system indices"
      />}
  />
  ```


#### Follow lint rules

To follow `eslint` rules for long default messages use backslashes in interpolated string.

  ```js
  <FormattedMessage
      id="management.indexPattern.create.step.status.noSystemIndicesWithPrompt"
      defaultMessage={`No Elasticsearch indices match your pattern. To view the matching system indices, \
  toggle the switch in the upper right.`}
  />
  ```
  Please make sure that there are no spaces and tabs on the next line after backslash.

#### Plural

#### Unit tests
