const Discord = require("discord.js");
const YTDL = require("ytdl-core");
const PREFIX = "t.";
const queue = new Map();
const EVERYONE = "@";

var client = new Discord.Client();

var bot = new Discord.Client();

var servers = {};

function play(connection, message) {
 var server = servers[message.guild.id];
    
    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
    
    server.queue.shift();
    
    server.dispatcher.on("end", function() {
     if (server.queue[0]) play(connection, message);
     else connection.disconnect();
    });
}

bot.on("ready", function () {
    bot.user.setGame("TrustBOT V1 - t.help |", "https://www.twitch.tv/zertek_")
    bot.user.setUsername("TrustBOT - V1")
    console.log("TrustBOT V1 - Connecté");
});

bot.on('message', function(message) {

        if(message.content === 'Salut') {
            message.reply('Bonjour')
        }

        if(message.content === 'salut') {
            message.reply('Bonjour')
        }

        if(message.content === 'Ilian') {
            message.channel.sendMessage("On ne juge mon **développeur **! :o")
        }

        if(message.content === 'ilian') {
            message.channel.sendMessage("On ne juge mon **développeur** ! :o")
        }

        if(message.content === 'ça va') {
            message.channel.sendMessage("Je vais toujours bien, je suis un robot!")
        }
            
        if(message.content === 'Ça va') {
            message.channel.sendMessage("Je vais toujours bien, je suis un robot!")
        }

        if(message.content === 'Qui est la') {
            message.channel.sendMessage("MOIII")
        
        }
        if(message.content === 'Bye') {
            message.channel.sendMessage('À Bientôt ! ^^')
        
        }
        if(message.content === 'bye') {
            message.channel.sendMessage('À Bientôt ! ^^')
        }

        if(message.content === 'wsh') {
            message.channel.sendMessage('wshh frr')
        }
    
        if(message.content === 'Wsh') {
            message.channel.sendMessage('wshh frr')
        }
    
    
    });

bot.on("guildMemberAdd", function(member) {
    member.guild.channels.find("name", "💬-general").sendMessage(member.toString() + " Bienvenue sur le discord de **Trust** ! :white_check_mark:");
    member.addRole(member.guild.roles.find("name", "Membre"));
});

bot.on("guildMemberRemove", function(member) {
     member.guild.channels.find("name", "💬-general").sendMessage(member.toString() + " Bye bye!" + member.toString() + " :x:");
});


bot.on("message", async function(message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split (" ");

    var args2 = message.content.split(" ").slice(1);

    var suffix = args2.join(" ");

    var reason = args2.slice(1).join(" ");
    
    var reasontimed = args2.slice(2).join(' ')

    var user = message.mentions.users.first();
    
    var guild = message.guild;
    
    var member = message.member;

    var roleJoueur= member.guild.roles.find("name", "Membre")
    
    var roleMute = member.guild.roles.find("name", "Mute")
    
    var modlog = member.guild.channels.find("name", "📄logs📄")
    
    var user = message.mentions.users.first();

    switch (args[0].toLowerCase()) {
        case "play":
            if (!args[1]) {
             message.channel.sendMessage("[`TrustBOT Musique`] - Vous devez mettre un lien.");   
             return;
            }
            if(!message.member.voiceChannel) {
             message.channel.sendMessage("[`TrustBOT Musique`] - Vous devez être dans un salon vocal.");   
             return;
            }
            
            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };
            
            var server = servers[message.guild.id];
      
            server.queue.push(args[1]);
            
            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
               play(connection, message) 
            });
        break;    
        case "stop":
             if(!message.member.voiceChannel) {
             message.channel.sendMessage("[`TrustBOT Musique`] - Vous devez être dans un **salon vocal**.");   
             return;
            }
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
        break;     
        case "membres":
            message.reply("Nous sommes " + bot.users.size + " membres sur le discord !");
        break
        case "unmute":
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
        if(!modlog) return message.reply("Je ne trouve pas de channel log. Contacte mon créateur pour qu'il me dit qu'elle channel sert de log.");
        var member = message.mentions.members.first();
        if (message.mentions.users.size < 1) return message.reply("À qui je retire la sanction: MUTE ?")
        member.removeRole(roleMute)
        message.channel.sendMessage(user.toString() + " a bien été unmute ✅")
        
        var embed = new Discord.RichEmbed()
        .addField("Commande :", "UNMUTE")
        .addField("Utilisateur :", user.username)
        .addField("Modérateur :", message.author.username)
        .addField("Heure:", message.channel.createdAt)
        .setColor("#3333cc")
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTimestamp()
        member.guild.channels.find("name", "📄logs📄").sendEmbed(embed);
        break;
        case "mute":
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.sendMessage("Tu n'as pas la permission d'exécuter la commande. :x:");
        if(!modlog) return message.reply("Je ne trouve pas de channel log. Contacte mon créateur pour qu'il me dit qu'elle channel sert de log.");  
        if (!reasontimed) return message.reply("Tu as oublié la raison ! :D")
        var member = message.mentions.members.first();
        if (message.mentions.users.size < 1) return message.reply("À qui je dois mettre la sanction: MUTE")
        message.channel.sendMessage(member.toString() + " a bien été mute. ✅")
        member.addRole(roleMute)

        var embed = new Discord.RichEmbed()
        .addField("Action :", "Mute")
        .addField("Utilisateur :", user.toString())
        .addField("Modérateur :", message.author.toString())
        .addField("Raison :", reasontimed)
        .setColor("#FFFF00")
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTimestamp()
        member.guild.channels.find("name", "📄logs📄").sendEmbed(embed);
        break;
        case "shelp":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
        var embed = new Discord.RichEmbed()
            .addField("t.ban", "Cette commande permet de bannir un utilisateur ! Pour l'utiliser, faites .ban @(utilisateur) + (raison)")
            .addField("t.kick", "Cette commande permet de kick un utilisateur ! Pour l'utiliser, faites .kick @(utilisateur) + (raison)")
             .addField("t.purge", "Cette commande permet de supprimé des messages beaucoup plus rapidement ! Pour l'utiliser, faites .purge (nombredemessages)")
             .addField("t.mute", "Cette commande permet de muté un utilisateur pendant un certain temps. Pour l'utiliser, faites .mute @(utilisateur) + (raison)")
             .addField("t.unmute", "Cette commande permet d'unmute un utilisateur. Pour l'utiliser, faites .unmute @(utilisateur)")
             .addField("t.staffhelp", "Cette commande permet d'afficher l'aide pour écrire les messages dans annonces")
            .setColor("#cc0000")
            .setFooter("Aide du staff.")
            .setAuthor("Pannel d'aide du staff")
            .setDescription("Voici les commandes du staff !")
            .setTimestamp()
            message.delete()
            message.channel.sendEmbed(embed)
        break;    
        
              case "staffhelp":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
        var embed = new Discord.RichEmbed()
            .addField("Info", "Il y a deux façon d'utiliser ces commandes, la façon avec la mention everyone et la façon sans, pour cela si vous voulez utiliser la mentions everyone marquer la commandes dans le salon ou le message va apparaître et en cas contraitre dans un salon ou les membres n'on pas accès.")
            .addField("t.annonces", "Cette commande permet de faire un message dans le salon ##📰annonces.")
            .addField("t.annoncesmine", "Cette commande permet de faire un message dans le salon #📰annonces-mine.")
            .setColor("#cc0000")
            .setFooter("Aide du staff.")
            .setAuthor("Pannel d'aide du staff")
            .setDescription("Voici les commandes du staff !")
            .setTimestamp()
            message.delete()
            message.channel.sendEmbed(embed)
        break;   
      
        case "help":
            var embed = new Discord.RichEmbed()
                 .addField("t.ping", "Grâce à cette commande, tu pourras savoir mon ping !") 
                 .addField("t.reseaux", "Vous donne les réseaux sociaux  de Zertek !")
                 .addField("t.play", "Jouer une musique !  Pour l'utiliser, faites .play (lien) !")
                 .addField("t.stop", "Arreter la musique  Pour l'utiliser, faites .stop !")
                 .addField("t.membre", "Permet de voir le nombre de personnes sur le discord !")
                 .addField("t.serveur", "Pour voir nos serveurs !")
                 .addField'"t.web", "Pour accèder a notre site !")
                 .addField("t.google", "Commande pas trop utile mais tu peut faire des recherche google. Pour l'utiliser, faites .google (recherche) !")
                 .addField("t.shelp", "❌Afficher les commandes du staff. Mais seule ceux qui ont la perm de kick pourrons y accèder. ❌")
                .setColor("#0000ff")
                .setFooter("Idée de commande ? Proposer en MP!")
                .setAuthor("Pannel d'aide")
                .setDescription("Voici les commandes du bot !")
                .setTimestamp()
                message.delete()
                message.channel.sendEmbed(embed)
            break;
        case "kick":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu n'as pas la permission d'exécuter la commande. :x:");
            if(!modlog) return message.reply("Je ne trouve pas de channel log. Contacte mon créateur pour qu'il me dit qu'elle channel sert de log.");
            if (reason.length < 1) return message.reply("Tu as oublié la raison ! :D");
            if (message.mentions.users.size < 1) return message.reply("Tu n'as pas mis son pseudo au complet ! :o")
            message.guild.member(user).kick();
            message.channel.send(user.toString() + " a bien été kick ✅")

            var embed = new Discord.RichEmbed()
            .addField("Commande :", "KICK")
            .addField("Utilisateur :", user.username)
            .addField("Modérateur :", message.author.username)
            .addField("Raison : ", reason)
            .addField("Heure:", message.channel.createdAt)
            .setColor("#99ff33")
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTimestamp()
            member.guild.channels.find("name", "📄logs📄").sendEmbed(embed);
            bot.channels.get('429665350922141716').sendMessage(":white_check_mark: Le joueur " + user.username + " à bien été kick pour: " + reason);
       
            message.delete();
            break;
        case "ban":
            if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande.");
            if(!modlog) return message.reply("Je ne trouve pas de channel log. Contacte mon créateur pour qu'il me dit qu'elle channel sert de log.");
            if (reason.length < 1) return message.reply("Tu as oublié la raison.");
            if (message.mentions.users.size < 1) return message.reply("Tu as oublié de préciser qui je dois bannir..")
            
            message.guild.ban(user, 2);
            message.channel.send(user.toString() + " a bien été banni ✅")

            var embed = new Discord.RichEmbed()
            .addField("Commande :", "BAN")
            .addField("Utilisateur :", user.username)
            .addField("Modérateur :", message.author.username)
            .addField("Raison : ", reason)
            .addField("Heure:", message.channel.createdAt)
            .setColor("#ff9933")
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTimestamp()
            member.guild.channels.find("name", "📄logs📄").sendEmbed(embed);
            
            bot.channels.get('429665350922141716').sendMessage(":white_check_mark: Le joueur " + user.username + " à bien été kick pour: " + reason);
            
            message.delete();
            break;
        case "purge":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
            var embed = new Discord.RichEmbed()
            .addField("Commande :", "Purge d'un Channel")
            .addField("Modérateur :", message.author.username)
            .addField("Message supprimé", messagecount)
            .addField("Heure:", message.channel.createdAt)
            .setColor("#009999")
            .setFooter("Ouf ! Sa as fait un bon ménage dans le serveur ! ^^")
            message.delete()
            member.guild.channels.find("name", "📄logs📄").sendEmbed(embed);
            break;

       case "reseaux":
            var embed = new Discord.RichEmbed()
                 .addField("Au passage", "Pense a a le follow !")
                 .addField("Youtube", "https://www.youtube.com/channel/UCClwL97b82Rmw9CiVS0z9bw") 
                 .addField("Twitter", "https://twitter.com/ZerTeK_")
                 .addField("Facebook", "https://www.facebook.com/ZerTeKyoutube/")
                 .addField("Twitch", "https://www.twitch.tv/zertek_")
                 .addField("Google +", "https://plus.google.com/+ZerTeKYtube")
                .setFooter("By Ilian")
                .setAuthor("Réseaux Sociaux de Zertek !")
                .setDescription("Pour l'actualité !")
                .setTimestamp()
                message.delete()
                message.channel.sendEmbed(embed)
           break;
      
           case "serveur":
           var embed = new Discord.RichEmbed()
                 .addField("[FR/QC] TrusT 1/2 - Roleplay | ZerTeK", "steam://connect/79.137.59.137:27015") 
                 .addField("[FR/QC] TrusT 2/2 - Roleplay | ZerTeK", "steam://connect/79.137.59.137:27016")
                 .addField("Mine", "steam://connect/79.137.59.137:27018")
                .setColor("#ffff00")
                .setFooter("Amuse toi bien sur nos serveur !")
                .setAuthor("Pannel des Serveurs")
                .setDescription("Petit rappelle, je vais seulement envoyé un liens pour que tu rejoins le serveur !")
                .setTimestamp()
                message.delete()
                message.channel.sendEmbed(embed)
            break; 

       case "ping":
        message.channel.sendMessage("Pong! Tu j'ai actuellement `" + bot.ping + " ms !` :D");
        message.delete();
        break; 
            
       case "google":
        let glg = message.content.split(' ');
        glg.shift();
        console.log("J'ai rechercher!");
        message.reply('https://www.google.fr/#q=' + glg.join('%20'));
        break;

       case "annonces":
         if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
       let newi = message.content.split(" ");
       newi.shift();
     var embed = new Discord.RichEmbed()
     .addField("Annonces !", " "+ newi.join(" "))
     .setColor("#FFFB00")
     .setFooter("By Ilian ! ^^")
     message.delete();
     message.channel.send("@everyone Du nouveau sur le serveur")
     member.guild.channels.find("name", "📰annonces").sendEmbed(embed);
     break;

     case "annoncesmine":
         if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
     let sondage = message.content.split(" ");
     sondage.shift();
   var embed = new Discord.RichEmbed()
   .addField("Annonnces!", " "+ sondage.join(" "))
   .setColor("#FF0000")
   .setFooter("By Ilian ! ^^")
   message.delete();
   message.channel.send("@everyone Du nouveau sur la mine")
   member.guild.channels.find("name", "📰annonces-mines").sendEmbed(embed);
   break;

   case "traductionhelp":
   var embed = new Discord.RichEmbed()
        .addField("t.tradenfr", "Traduction Anglais ==> Français !") 
        .addField("t.tradfren", "Traduction Français ==> Anglais !")
        .addField("t.tradesfr", "Traduction Espagnol ==> Français !")
        .addField("t.tradfres", "Taduction Français ==> Espagnol !")
        .addField("t.tradesen", "Traduction Espagnol ==> Anglais !")
        .addField("t.tradenes", "Taduction Anglais ==> Espagnol !")            
       .setColor("#00ffcc")
       .setFooter("Amuse toi a traduire petit enfant !")
       .setAuthor("Pannel des Traduction")
       .setDescription("Petit rappelle le, je vais seulement envoyé un liens google traduction !")
       .setTimestamp()
       message.delete()
       message.channel.sendEmbed(embed)
   break;      

case "tradenfr":
let tradenfr = message.content.split(' ');
tradenfr.shift();
console.log("Traduction Anglais ==> Français");
message.reply('https://translate.google.fr/#en/fr/' + tradenfr.join('%20'));
break;

case "tradfren":
let tradfren = message.content.split(' ');
tradfren.shift();
console.log("Traduction Français ==> Anglais");
message.reply('https://translate.google.fr/#fr/en/' + tradfren.join('%20'));
break;

case "tradesfr":
let tradesfr = message.content.split(' ');
tradesfr.shift();
console.log("Traduction Espagnol ==> Français");
message.reply('https://translate.google.fr/#es/fr/' + tradesfr.join('%20'));
break;

case "tradfres":
let tradfres = message.content.split(' ');
tradfres.shift();
console.log("Traduction Français ==> Espagnol");
message.reply('https://translate.google.fr/#fr/es/' + tradfres.join('%20'));
break;      

case "tradenes":
let tradenes = message.content.split(' ');
tradenes.shift();
console.log("Traduction Anglais ==> Espagnol");
message.reply('https://translate.google.fr/#en/es/' + tradesen.join('%20'))
break;
      
   case "web":
   var embed = new Discord.RichEmbed()
        .addField("Forum", "http://forum.trust-gaming.fr/") 
        .addField("Panel", "http://trust-gaming.fr/panel")
        .addField("Membres", "http://trust-gaming.fr/forum/memberlist.php")        
       .setColor("#00ffcc")
       .setFooter("Ne fais pas de bétise sur le Forum !")
       .setAuthor("Notre site")
       .setDescription("Notre Forum & Boutique")
       .setTimestamp()
       message.delete()
       message.channel.sendEmbed(embed)
   break;       
      
        default:
            message.channel.sendMessage("Commande invalide ^^ Fait t.help pour voir toutes les commandes disponibles !")
            message.delete();
    }
});

bot.login('NDM5MDc3NzE1MjI0ODIxNzYx.DcOH6A.A2HdEF0iV7huwdYAlZQSaEl0JWk');
