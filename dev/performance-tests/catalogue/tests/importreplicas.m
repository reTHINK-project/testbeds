function [dem_req_rate,req_rate,con_rate,min_rep_rate,avg_rep_rate,max_rep_rate,stddev_rep_rate,resp_time,net_io,errors] = importreplicas(fileBaseName, numReplicas)
%IMPORTREPLICAS Import all replicas of experiments, each stored in FILEBASENAME
%   [DEM_REQ_RATE,REQ_RATE,CON_RATE,MIN_REP_RATE,AVG_REP_RATE,MAX_REP_RATE,STDDEV_REP_RATE,RESP_TIME,NET_IO,ERRORS]
%   = IMPORTFILE(FILEBASENAME, NUMREPLICAS) Reads data from text file FILEBASENAME_i.tab where i is set from 1 to NUMREPLICAS.
%   The file is read via IMPORTFILE.
%
%   Note that the return vector is the same as for IMPORTFILE except that 
%   each element contains all replicas read. DEM_REQ_RATE(1,:), e.g.,
%   contains exactly DEM_REQ_RATE as read from the first replica file via
%   IMPORTFILE
%

for i = 1:numReplicas
    
    fname = strcat(fileBaseName, num2str(i), '.tab');
    
    [dem_req_rate(i,:),req_rate(i,:),con_rate(i,:),min_rep_rate(i,:),avg_rep_rate(i,:),max_rep_rate(i,:),stddev_rep_rate(i,:),resp_time(i,:),net_io(i,:),errors(i,:)]= importfile(fname);


end