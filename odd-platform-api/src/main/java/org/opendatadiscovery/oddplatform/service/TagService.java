package org.opendatadiscovery.oddplatform.service;

import java.util.List;
import java.util.Set;
import org.opendatadiscovery.oddplatform.api.contract.model.Tag;
import org.opendatadiscovery.oddplatform.api.contract.model.TagFormData;
import org.opendatadiscovery.oddplatform.api.contract.model.TagsResponse;
import org.opendatadiscovery.oddplatform.dto.TagDto;
import org.opendatadiscovery.oddplatform.model.tables.pojos.TagPojo;
import org.opendatadiscovery.oddplatform.model.tables.pojos.TagToDataEntityPojo;
import org.opendatadiscovery.oddplatform.model.tables.pojos.TagToTermPojo;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface TagService {

    Flux<Tag> bulkCreate(final List<TagFormData> tags);

    Mono<Tag> update(final long tagId, final TagFormData formData);

    Mono<Tag> delete(final long tagId);

    Mono<TagsResponse> listMostPopular(final String query, final List<Long> ids, final int page, final int size);

    Mono<List<TagPojo>> getOrCreateTagsByName(final Set<String> tagNames);

    Flux<TagPojo> getOrInjectTagByName(final Set<String> tagNames);

    Mono<List<TagDto>> updateRelationsWithDataEntity(final long dataEntityId,
                                                     final Set<String> tagNames);

    Flux<TagToDataEntityPojo> deleteRelationsForDataEntity(final long dataEntityId);

    Flux<TagToTermPojo> deleteRelationsWithTerm(final long termId,
                                                final Set<String> tagsToKeep);

    Flux<TagToTermPojo> createRelationsWithTerm(final long termId,
                                                final List<TagPojo> tags);
}
