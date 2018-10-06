DROP TABLE IF EXISTS advertiser;
DROP TABLE IF EXISTS advertisement;

CREATE TABLE advertisers (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       username TEXT UNIQUE NOT NULL,
       balance TEXT NOT NULL,
       password TEXT NOT NULL,
       address TEXT NOT NULL
);

CREATE TABLE advertisements (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       advertiser INTEGER NOT NULL,
       created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
       advertisement TEXT NOT NULL,
       price INTEGER NOT NULL,
       publisher_reward INTEGER NOT NULL,
       viewer_reward INTEGER NOT NULL,
       FOREIGN KEY (advertiser) REFERENCES advertisers (id)
);

INSERT INTO advertisers (username, balance, password, address) VALUES (
       'example scihub fan',
       '9223372036854775807',
       'my password is strong like a bull!!11!!',
       '0x0000000000000000000000000000000000000000'
       );

INSERT INTO advertisements (
       advertiser, price, publisher_reward, viewer_reward, advertisement
       ) VALUES (
         1,
         100,
         200,
         50,
         '<blink>Donate to Sci-Hub at 1K4t2vSBSS2xFjZ6PofYnbgZewjeqbG1TM !!!</blink>'
)
