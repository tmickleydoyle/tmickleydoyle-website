import React from "react";

const MetricsMethodologyDoc = () => {
  return (
    <div>
      <h1>
        Methodology for Building and Rolling Up Metrics for Company Reports
      </h1>

      <h2>Overview</h2>
      <p>
        This document outlines the methodology for developing metrics from raw
        source data to fully rolled-up metrics used in company reports. The goal
        is to ensure a consistent, reliable flow of data that informs key
        business decisions. The methodology defines the roles and
        responsibilities of data owners, pipeline maintainers, and downstream
        stakeholders, as well as the structure of metrics and processes for
        monitoring and troubleshooting.
      </p>

      <h2>Roles and Responsibilities</h2>
      <h3>1. Data Source Owners</h3>
      <ul>
        <li>
          <strong>Responsibility:</strong> Data source owners are responsible
          for managing the integrity and quality of the data at the source. They
          ensure that all data related to entity activities (e.g., user actions
          such as clicking a button) is captured and transmitted through the
          data pipelines to the analytics warehouse.
        </li>
        <li>
          <strong>Change Management:</strong> If there are changes to the data
          structure, format, or source, data source owners must notify the
          downstream teams in advance. This notification should provide
          sufficient time for downstream teams to adjust to these changes
          without disrupting the flow of data.
        </li>
        <li>
          <strong>Continuous Data Flow:</strong> Data source owners must ensure
          continuous and accurate data flow into the pipelines, minimizing
          disruptions to downstream processes.
        </li>
      </ul>

      <h3>2. Pipeline Maintenance Team</h3>
      <ul>
        <li>
          <strong>Responsibility:</strong> The pipeline maintenance team is
          accountable for ensuring that data flows from the source to the
          analytics warehouse in a timely and accurate manner. This team
          maintains the data pipelines, ensuring they are operational and
          delivering data as expected.
        </li>
        <li>
          <strong>Alerts and Communication:</strong> If there are delays or
          issues with the data, such as data not being in the expected shape,
          the pipeline maintenance team must promptly alert downstream teams.
          Effective communication is essential to ensure that downstream
          processes can adapt or pause as needed.
        </li>
      </ul>

      <h3>3. Downstream Data Modelers/Analytics Engineers</h3>
      <ul>
        <li>
          <strong>Responsibility:</strong> Downstream data modelers and
          analytics engineers collaborate with data source owners, pipeline
          maintainers, and business stakeholders to transform raw data into
          structured metrics. They are responsible for creating and maintaining
          the data models that underpin company metrics.
        </li>
        <li>
          <strong>Metric Structuring:</strong> Metrics are to be structured
          hierarchically, resembling an upside-down tree. The most granular
          metrics form the branches, which then roll up into higher-level
          metrics. This hierarchical structuring is critical for tracing how
          different components contribute to the overall metric.
        </li>
        <li>
          <strong>Stakeholder Collaboration:</strong> Regular collaboration with
          business stakeholders is necessary to ensure that metrics accurately
          reflect business goals and provide actionable insights.
        </li>
      </ul>

      <h2>Metric Structuring and Rollup Process</h2>
      <h3>1. Upside-Down Tree Structure</h3>
      <ul>
        <li>
          <strong>Granularity:</strong> The most granular metrics represent
          specific activities or data points, such as user interactions or
          specific product performance metrics. These granular metrics form the
          outer branches of the tree.
        </li>
        <li>
          <strong>Roll-Up Mechanism:</strong> As you move inward toward the base
          of the tree, these granular metrics are aggregated into higher-level
          metrics. This process continues until all metrics roll up into a
          final, overall metric at the base of the tree.
        </li>
        <li>
          <strong>Purpose:</strong> The structured roll-up allows for easy
          identification of levers that influence the overall metrics. By
          analyzing the individual branches, teams can identify areas of
          improvement or growth opportunities within specific product families
          or user behaviors.
        </li>
      </ul>

      <h3>2. Influence on Growth</h3>
      <ul>
        <li>
          <strong>Metric Branching:</strong> Breaking metrics into multiple
          branches helps to pinpoint specific activities or product elements
          that drive growth. Understanding these details is essential for
          optimizing performance across different segments of the business.
        </li>
        <li>
          <strong>Growth Analysis:</strong> By tracking the performance of
          individual branches, teams can experiment with changes to see their
          impact on the overall metric, thereby driving growth and efficiency in
          larger product families.
        </li>
      </ul>

      <h2>Monitoring and Alerting</h2>
      <h3>1. Alerting Mechanisms</h3>
      <ul>
        <li>
          <strong>Metric Growth Monitoring:</strong> Establish acceptable
          thresholds for metric growth. Automated alerts should be set up to
          notify relevant teams if metrics fall outside these thresholds,
          indicating potential issues.
        </li>
        <li>
          <strong>Proactive Communication:</strong> Alerts should trigger
          proactive communication across teams to address potential issues
          before they escalate.
        </li>
      </ul>

      <h3>2. Troubleshooting Playbooks</h3>
      <ul>
        <li>
          <strong>Playbook Creation:</strong> Develop troubleshooting playbooks
          that outline the steps to be taken when metrics deviate from expected
          patterns. These playbooks should clearly define roles,
          responsibilities, and escalation paths for resolving data-related
          issues.
        </li>
        <li>
          <strong>Team Involvement:</strong> Ensure that all partner teams are
          aware of their roles in the troubleshooting process. Regular training
          and updates to the playbooks are necessary to keep them effective and
          relevant.
        </li>
      </ul>

      <h2>Conclusion</h2>
      <p>
        By following this methodology, the company can ensure that its metrics
        are built on reliable data, structured in a way that supports business
        growth, and monitored to prevent and resolve issues proactively.
        Consistent communication, collaboration, and clearly defined processes
        are essential for the success of this approach.
      </p>
    </div>
  );
};

export default MetricsMethodologyDoc;
