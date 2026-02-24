# Thoughts and notes

To make the process more straightforward, I decided to commit to the `master` branch and not create separate PRs.
In a normal workflow, I would create fairly small PRs so they are easy to review by other people and contain a
digestible and meaningful deltas.
Nevertheless, the commits are pretty granular, so it is easy to follow the workflow and understand my thoughts process
and the way I built the app.

## Future plans / suggestions

1. In the future we might save the document in S3 when calling the `/documents/metadata:parse` endpoint:
    1. Once a document is uploaded, we can schedule a job to parse the doc asynchronously:
        - we can handle more requests per second;
        - we remove an "immediate dependency" on downstream service (i.e. OpenAI / Claude API) for the doc `:parse`
          endpoint;
        - the service is more reliable;
    2. In case of a parsing error, the user doesn't need to upload the doc again:
        - the doc is uploaded, saved in S3, registered in the system, and will eventually be processed;
    3. (note) there is an opportunity to set up a webhook once LLM's response is ready → fully async flow;
2. in case of HTML docs, it makes sense to have a pre-filter without LLMs in order to remove all the "system" info,
   scripts, styles, and maybe the tag names (and other irrelevant attributes):
    - The majority of LLM tokens were "eaten" by these specifications, not the content itself - it could be optimised;
    - I've briefly checked tools and found this - https://markdown.new/ (converts HTML into LLM friendly Markdown which,
      as they say, reduces the number of tokens up to 80%);

### Project structure

1. Architecture wise, it would be best to split the current vision of "OpenAI module" into 3. For the sake of
   simplicity, I combined them in one:
    1. The general OpenAI module where the LLM client configuration and some common security rules are defined;
    2. The “document parsing” module which would encapsulate the "How" part of the parsing logic by providing a clear
       interface. It would use the next module;
    3. The “LLM instructions for document parsing” module which would contain all the prompts and models relevant to
       this operation only;
2. Every single module as well as the `common` package could be a _pnpm's workspace_. This way each team could work more
   autonomously as long as supporting the contract. It could also help us save time and money with the CI / CD pipeline
   by running the tests for the affected parts of the app only (based on the dependency graph and turborepo);

## Data related

1. I decided not to use GraphQL, because:
    1. I don't have a hands-on experience with this tool yet :)
    2. Without GraphQL, it's easier to monitor and deploy the endpoints separately to scale them separately as well
       based on their usage pattern;
    3. It seems like GraphQL has a fairly limited GET method functionality (limited by the max length of the URL) and
       heavily relies on POST methods (not cacheable at the HTTP level) - HTTP caches will not cache POST requests.
2. Use different schemas for DB entity and DTO to have clear boundaries / bulkheads;
3. I decided to split "a summary of the case and its conclusion" required metadata field into 2 fields for (free-text)
   filter
   convenience:
    - In case we need to retrieve a full case summary, we can simply concat these 2 fields and return;
4. UUIDv4 (not v7) is used for the doc metadata ids because they are purely random - it's a good idea for the generated
   metadata records which are external-facing;
5. For the sake of simplicity, the pagination is offset-based:
    1. It might be a tech-debt ticket to switch to a cursor-based pagination;
    2. Overall cursor-based pagination works better when we parse more and more docs, especially in parallel with
       reading them;

### Side-note ideas

1. Once we have an "authenticated users" we can also add `created_by` field:
    - Then we can also think of `verified_by` field in case it is important to make an audit / sanity check of all the
      generated metadata;
2. To have a granular resource permissions such as `resourceName:resourceId:requiredPermissions`, where
   `resourceId` could be an asterisk (`*`) for admin users.

## LLM related

1. It seems like I don't have to use the most recent model to do this type of task. I was recommended (by ChatGPT)
   to use OpenAI model `gpt-4.1`. I quickly checked different configuration of `gpt-4.1` model and decided to use
   `gpt-4.1-mini`:
    - it's cheaper and showed better results with my final prompts;
    - had better Rate Limits - 200K tokens per request vs 30K tokens per request for `gpt-4.1` (was relevant for HTML
      files);

2. (Security) We also need to think of potential instruction injections - e.g. in case of injections, we should stop the
   parsing and return `null`;

### Side-note ideas

1. [Monitoring] Once the LLM returns a response, we can check for `null` fields and notify via Slack that some of
   the data is missing for a given document;

## Misc

### Docker troubleshooting

1. When using `networks` within docker-compose you should use the name of the service as you hostname:
    - so in my case the hostname should be db and not localhost;
    - read more about it: https://docs.docker.com/compose/networking/

## Open questions

Mostly business related - I would ask a PM.

1. What language should we support? Is it an English only platform or should we ask the LLM to provide a metadata using
   the same language as the document?
2. It might be useful to define a clear set of possible `decision_type` values:
    - it depends on business needs and how we want to show / be able to filter the data;
3. There is also "application/xhtml+xml" file mimetype. We don't support is yet - should we support it?
