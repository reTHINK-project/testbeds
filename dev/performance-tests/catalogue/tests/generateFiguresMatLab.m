clear

[dem_req_rate,req_rate,con_rate,min_rep_rate,avg_rep_rate,max_rep_rate,stddev_rep_rate,resp_time,net_io,errors]= importfile('results.tab');

% one figure with all graphs
figure
plot(dem_req_rate,avg_rep_rate,'DisplayName','avg rep rate');
hold all;
plot(dem_req_rate,con_rate,'DisplayName','con rate');
plot(dem_req_rate,errors,'DisplayName','errors');
plot(dem_req_rate,max_rep_rate,'DisplayName','max rep rate');
plot(dem_req_rate,min_rep_rate,'DisplayName','min rep rate');
plot(dem_req_rate,net_io,'DisplayName','net io');
plot(dem_req_rate,req_rate,'DisplayName','req rate');
plot(dem_req_rate,resp_time,'DisplayName','resp time');
plot(dem_req_rate,stddev_rep_rate,'DisplayName','stddev rep rate');
hold off;
title('all in one figure')


figure
xlabel('Configured Request Rate (per autobench) [Hz]')
ylabel('Frequency [Hz]')
hold all
plot(dem_req_rate,con_rate,'DisplayName','Measured Connection Rate');
plot(dem_req_rate,req_rate,'DisplayName','Measured Request Rate');
plot(dem_req_rate,avg_rep_rate,'DisplayName','Measured Avg. Response Rate');
plot(dem_req_rate,dem_req_rate,'DisplayName','Linear Progression (y=x)');
hold off


figure
xlabel('Configured Request Rate (per autobench) [Hz]')
ylabel('Frequency [Hz]')
hold all
plot(dem_req_rate,dem_req_rate - req_rate,'DisplayName','Measured Request Rate');
plot(dem_req_rate,dem_req_rate - avg_rep_rate,'DisplayName','Measured Avg. Response Rate');
plot(dem_req_rate, 0.05 * dem_req_rate,'DisplayName','5% cut-off line');
hold off
title('Difference demanded request rate to acutal request (response) rate')


figure
xlabel('Configured Request Rate (per autobench) [Hz]')
ylabel('Time [ms]')
hold all
plot(dem_req_rate,resp_time,'DisplayName','Response Time');
hold off
title('Catalogue Response time')



