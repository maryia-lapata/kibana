<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [kibana-plugin-server](./kibana-plugin-server.md) &gt; [SavedObjectsServiceStart](./kibana-plugin-server.savedobjectsservicestart.md) &gt; [createScopedRepository](./kibana-plugin-server.savedobjectsservicestart.createscopedrepository.md)

## SavedObjectsServiceStart.createScopedRepository property

Creates a [Saved Objects repository](./kibana-plugin-server.isavedobjectsrepository.md) that uses the credentials from the passed in request to authenticate with Elasticsearch.

<b>Signature:</b>

```typescript
createScopedRepository: (req: KibanaRequest, extraTypes?: string[]) => ISavedObjectsRepository;
```

## Remarks

Prefer using `getScopedClient`<!-- -->. This should only be used when using methods not exposed on [SavedObjectsClientContract](./kibana-plugin-server.savedobjectsclientcontract.md)
