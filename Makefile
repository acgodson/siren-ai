compile :; \
        cd zk-proof/circuits && \
        cd check_age && $$HOME/.nargo/bin/nargo compile && cd ..
install :; \
        cd zk-proof/app && \
        npm install

deploy :; \
        cd app && \
        npm run build && \
        surge dist graceful-believe.surge.sh
