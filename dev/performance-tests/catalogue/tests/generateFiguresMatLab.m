function generateFiguresMatlab(fileBaseName, replicas, paraExplenation)
%GENERATEFIGURESMATLAB Generate figures based on httperf measurements
%   GENERATEFIGURESMATLAB(FILEBASENAME, REPLICAS, PARAEXPLENATION) Reads 
%       data from text file FILEBASENAME_i.tab where i is set from 1 to 
%       REPLICAS.  The string provided by PARAEXPLENATION is added to each
%       figure's title; it should contain the parameters of the experiment
%   The file is read via IMPORTFILE.

%clear

%replicas=1
%fileBaseName='response_time_numcalls_1_'

% import all replicas
[replicas_dem_req_rate,replicas_req_rate,replicas_con_rate,replicas_min_rep_rate,replicas_avg_rep_rate,replicas_max_rep_rate,replicas_stddev_rep_rate,replicas_resp_time,replicas_net_io,replicas_errors]= importreplicas(fileBaseName, replicas);

% statistic analyzis

% batch means accross replicas
bm_dem_req_rate = mean(replicas_dem_req_rate, 1);
bm_req_rate = mean(replicas_req_rate, 1);
bm_con_rate = mean(replicas_con_rate, 1);
bm_min_rep_rate = mean(replicas_min_rep_rate, 1);
bm_avg_rep_rate = mean(replicas_avg_rep_rate, 1);
bm_max_rep_rate = mean(replicas_max_rep_rate, 1);
bm_stddev_rep_rate = mean(replicas_stddev_rep_rate, 1);
bm_resp_time = mean(replicas_resp_time, 1);
bm_net_io = mean(replicas_net_io, 1);
bm_errors = mean(replicas_errors, 1);

% x = randi(50, 1, 100);                      % Create Data
% SEM = std(x)/sqrt(length(x));               % Standard Error
% ts = tinv([0.025  0.975],length(x)-1);      % T-Score
% CI = mean(x) + ts*SEM;   
%
% calculate confidence intervalls

conlevel = 0.95;
len = length(replicas_dem_req_rate(:,1));   % all vectors come from the same
                                            % set of experiments and should
                                            % have the same length                   
sqrtLen = sqrt(len);
ts = tinv(conlevel, len-1);

sem_bm_dem_req_rate = std(replicas_dem_req_rate, 0, 1) / sqrtLen;
ci_bm_dem_req_rate = [  bm_dem_req_rate - ts * sem_bm_dem_req_rate; ...
                        bm_dem_req_rate + ts * sem_bm_dem_req_rate ];

sem_bm_req_rate = std(replicas_req_rate, 0, 1) / sqrtLen;
ci_bm_req_rate = [  bm_req_rate - ts * sem_bm_req_rate; ...
                    bm_req_rate + ts * sem_bm_req_rate ];
                
sem_bm_con_rate = std(replicas_con_rate, 0, 1) / sqrtLen;
ci_bm_con_rate = [  bm_con_rate - ts * sem_bm_con_rate; ...
                    bm_con_rate + ts * sem_bm_con_rate ];

sem_bm_min_rep_rate = std(replicas_min_rep_rate, 0, 1) / sqrtLen;
ci_bm_min_rep_rate = [  bm_min_rep_rate - ts * sem_bm_min_rep_rate; ...
                    bm_min_rep_rate + ts * sem_bm_min_rep_rate ];


sem_bm_avg_rep_rate = std(replicas_avg_rep_rate, 0, 1) / sqrtLen;                
ci_bm_avg_rep_rate = [  bm_avg_rep_rate - ts * sem_bm_avg_rep_rate; ...
                    bm_avg_rep_rate + ts * sem_bm_avg_rep_rate ];
                
sem_bm_max_rep_rate = std(replicas_max_rep_rate, 0, 1) / sqrtLen;
ci_bm_max_rep_rate = [  bm_max_rep_rate - ts * sem_bm_max_rep_rate; ...
                    bm_max_rep_rate + ts * sem_bm_max_rep_rate ];

sem_bm_stddev_rep_rate = std(replicas_stddev_rep_rate, 0, 1) / sqrtLen;
ci_bm_stddev_rep_rate = [  bm_stddev_rep_rate - ts * sem_bm_stddev_rep_rate; ...
                    bm_stddev_rep_rate + ts * sem_bm_stddev_rep_rate ];

sem_bm_resp_time = std(replicas_resp_time, 0, 1) / sqrtLen;
ci_bm_resp_time = [  bm_resp_time - ts * sem_bm_resp_time; ...
                    bm_resp_time + ts * sem_bm_resp_time ];

sem_bm_net_io = std(replicas_net_io, 0, 1) / sqrtLen;
ci_bm_net_io = [  bm_net_io - ts * sem_bm_net_io; ...
                    bm_net_io + ts * sem_bm_net_io ];

sem_bm_errors = std(replicas_errors, 0, 1) / sqrtLen;
ci_bm_errors = [  bm_errors - ts * sem_bm_errors; ...
                    bm_errors + ts * sem_bm_errors ];





% one figure with all graphs
figure
plot(bm_dem_req_rate,bm_avg_rep_rate,'DisplayName','avg rep rate');
hold all;
plot(bm_dem_req_rate,bm_con_rate,'DisplayName','con rate');
plot(bm_dem_req_rate,bm_errors,'DisplayName','errors');
plot(bm_dem_req_rate,bm_max_rep_rate,'DisplayName','max rep rate');
plot(bm_dem_req_rate,bm_min_rep_rate,'DisplayName','min rep rate');
plot(bm_dem_req_rate,bm_net_io,'DisplayName','net io');
plot(bm_dem_req_rate,bm_req_rate,'DisplayName','req rate');
plot(bm_dem_req_rate,bm_resp_time,'DisplayName','resp time');
plot(bm_dem_req_rate,bm_stddev_rep_rate,'DisplayName','stddev rep rate');
hold off;
figname = {'all in one figure', strcat('(',paraExplenation, ')') };
title(figname)


figure
xlabel('Demanded Request Rate (per autobench) [Hz]')
ylabel('Frequency [Hz]')
hold all
plot(bm_dem_req_rate,bm_con_rate,'DisplayName','Measured Connection Rate');
plot(bm_dem_req_rate,bm_req_rate,'DisplayName','Measured Request Rate');
plot(bm_dem_req_rate,bm_avg_rep_rate,'DisplayName','Measured Avg. Response Rate');
plot(bm_dem_req_rate,bm_dem_req_rate,'DisplayName','Linear Progression (y=x)');
hold off
figname = {'Connection / Request vs. Response Rate', strcat('(',paraExplenation, ')') };
title(figname)


figure
xlabel('Demanded Request Rate (per autobench) [Hz]')
ylabel('Frequency [Hz]')
hold all
plot(bm_dem_req_rate,bm_dem_req_rate - bm_req_rate,'DisplayName','Measured Request Rate');
plot(bm_dem_req_rate,bm_dem_req_rate - bm_avg_rep_rate,'DisplayName','Measured Avg. Response Rate');
plot(bm_dem_req_rate, 0.05 * bm_dem_req_rate,'DisplayName','5% cut-off line');
hold off
figname = {'Difference demanded request rate to acutal request (response) rate', strcat('(',paraExplenation, ')') };
title(figname)


figure
xlabel('Demanded Request Rate (per autobench) [Hz]')
ylabel('Time [ms]')
hold all
plot(bm_dem_req_rate,bm_resp_time,'DisplayName','Response Time');
plot(bm_dem_req_rate,ci_bm_resp_time,'DisplayName',strcat(conlevel*100, '% Confidence Interval'));

hold off
figname = {'Catalogue Response time', strcat('(',paraExplenation, ')') };
title(figname)



figure
xlabel('Demanded Request Rate (per autobench) [Hz]')
ylabel('Time [ms]')
hold all
plot(bm_dem_req_rate,bm_errors,'DisplayName','Errors');
hold off
figname = {'Encounterned Errors', strcat('(',paraExplenation, ')') };
title(figname)




