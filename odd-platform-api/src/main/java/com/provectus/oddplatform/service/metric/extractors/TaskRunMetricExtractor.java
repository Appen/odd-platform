package com.provectus.oddplatform.service.metric.extractors;

import com.provectus.oddplatform.dto.IngestionDataStructure;
import com.provectus.oddplatform.dto.IngestionTaskRun;
import com.provectus.oddplatform.service.metric.dto.MetricDataTriplet;
import com.provectus.oddplatform.utils.Pair;
import io.opentelemetry.api.common.AttributeKey;
import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.sdk.metrics.data.LongPointData;
import io.opentelemetry.sdk.metrics.data.MetricData;
import io.opentelemetry.sdk.metrics.data.PointData;
import java.time.Duration;
import java.util.stream.Stream;
import org.springframework.stereotype.Component;

import static com.provectus.oddplatform.service.metric.extractors.ExtractorUtils.longPointData;

@Component
public class TaskRunMetricExtractor implements MetricExtractor {
    @Override
    public Stream<MetricData> extract(final IngestionDataStructure dataStructure) {
        final Stream<Pair<MetricDataTriplet, ? extends PointData>> metricStream = dataStructure.getTaskRuns()
            .stream()
            .filter(taskRun -> taskRun.getEndTime() != null)
            .flatMap(this::buildMetrics);

        return gaugeStream(metricStream);
    }

    private Stream<Pair<MetricDataTriplet, LongPointData>> buildMetrics(final IngestionTaskRun taskRun) {
        final long duration = Duration.between(taskRun.getEndTime(), taskRun.getStartTime()).getSeconds();

        final long status = taskRun.getStatus().equals(IngestionTaskRun.IngestionTaskRunStatus.SUCCESS) ? 1L : 0L;

        final Attributes attributes =
            Attributes.of(AttributeKey.stringKey("job_oddrn"), taskRun.getDataEntityOddrn());

        return Stream.of(
            Pair.of(MetricDataTriplet.TASK_RUN_DURATION, longPointData(duration, attributes)),
            Pair.of(MetricDataTriplet.DF_NULLS_COUNT, longPointData(status, attributes))
        );
    }
}
