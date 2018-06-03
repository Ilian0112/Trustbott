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
    bot.user.setActivity("TrustBOT V1 - t.help | Par Ilian", {
        'type': 'STREAMING',
        'url': "https://www.twitch.tv/zertek_"
    }),
    bot.user.setUsername("TrustBOT - V1")
    bot.channels.find("name", "logs-radio").send("Je suis connectée !");
    console.log("TrustBOT V1 - Connecté");
});

bot.on("guildMemberAdd", function(member) {
    member.guild.channels.find("name", "💬-general").send(member.toString() + " Bienvenue sur ``" + message.guild.name + "`` ! :white_check_mark:");
    member.guild.channels.find("name", "general").send(member.toString() + " Bienvenue sur ``" + message.guild.name + "`` ! :white_check_mark:");
})

bot.on("guildMemberRemove", function(member) {
     member.guild.channels.find("name", "💬-general").send(member.toString() + " Bye bye!" + member.toString() + " :x:");
     member.guild.channels.find("name", "general").send(member.toString() + " Bye bye!" + member.toString() + " :x:");
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
    
    var roleMute = member.guild.roles.find("name", "Mute")
    
    var modlog = member.guild.channels.find("name", "📄logs📄")
    
    var user = message.mentions.users.first();

    switch (args[0].toLowerCase()) {
        case "play":
            if (!args[1]) {
             message.channel.sendMessage("[``TrustBOT Musique``] - Vous devez mettre un lien.");   
             return;
            }
            if(!message.member.voiceChannel) {
             message.channel.sendMessage("[``TrustBOT Musique``] - Vous devez être dans un salon vocal.");   
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
             message.channel.sendMessage("[``TrustBOT Musique``] - Vous devez être dans un **salon vocal**.");   
             return;
            }
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
        break;     
      
        case "servinfo":
        var servinfo_embed = new Discord.RichEmbed()
            .setTitle("Information du Serveur " + message.guild.name)
            .addField("Nombre de Membre", "Il y a ``" + message.guild.memberCount + " membres`` sur le serveur.")
            .addField("Proprio du Serveur", "Le proprio du serveur est " + message.guild.owner)
            .setColor("#cc0000")
            .setTimestamp()
            message.delete()
            message.channel.sendEmbed(servinfo_embed)
        break
      
        case "unmute":
        if(!message.member.hasPermission("MUTE_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
        var member = message.mentions.members.first();
        if (message.mentions.users.size < 1) return message.reply("À qui je retire la sanction: ``Mute`` ?")
        member.removeRole(roleMute)
        message.channel.sendMessage(user.toString() + " a bien été unmute ✅")
        break;
      
        case "mute":
        if(!message.member.hasPermission("MUTE_MEMBERS")) return message.channel.sendMessage("Tu n'as pas la permission d'exécuter la commande. :x:");
        if (!reasontimed) return message.reply("Tu as oublié la raison ! :D")
        var member = message.mentions.members.first();
        if (message.mentions.users.size < 1) return message.reply("À qui je dois mettre la sanction: ``Mute``")
        message.channel.sendMessage(member.toString() + " a bien été mute pour " + reasontimed + ". ✅")
            member.roles.forEach(role => {
                member.removeRole(role)
            })      
        member.addRole(roleMute)
        break;
      
        case "shelp":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
        var embed = new Discord.RichEmbed()
            .addField(PREFIX + "ban", "Cette commande permet de bannir un utilisateur ! Pour l'utiliser, faites .ban @(utilisateur) + (raison)")
            .addField(PREFIX + "kick", "Cette commande permet de kick un utilisateur ! Pour l'utiliser, faites .kick @(utilisateur) + (raison)")
             .addField(PREFIX + "purge", "Cette commande permet de supprimé des messages beaucoup plus rapidement ! Pour l'utiliser, faites .purge (nombredemessages)")
             .addField(PREFIX + "mute", "Cette commande permet de muté un utilisateur pendant un certain temps. Pour l'utiliser, faites .mute @(utilisateur) + (raison)")
             .addField(PREFIX + "unmute", "Cette commande permet d'unmute un utilisateur. Pour l'utiliser, faites .unmute @(utilisateur)")
             .addField(PREFIX + "staffhelp", "Cette commande permet d'afficher l'aide pour écrire les messages dans annonces")
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
               .addField("Commande Serveur Gmod", "Ici tu aura les commandes faisable dans le serveur Discord du serveur __**Garry's Mod**__")
               .addField("Info", "Il y a deux façon d'utiliser ces commandes, la façon avec la mention everyone et la façon sans, pour cela si vous voulez utiliser la mentions everyone marquer la commandes dans le salon ou le message va apparaître et en cas contraitre dans un salon ou les membres n'on pas accès.")
               .addField(PREFIX + "annoncesgmd", "Cette commande permet de faire un message dans le salon ``#📰annonces``.")
               .addField(PREFIX + "annoncesmine", "Cette commande permet de faire un message dans le salon ``#📰annonces-mine``.")
               .addBlankField()
               .addField("Commande Serveur MC", "Ici tu aura les commandes faisable dans le serveur Discord du serveur _**Minecraft**__")
               .addField(PREFIX + "annoncesmc", "Cette commande permet de faire un message dans le salon ``#annonces``.")
               .addField(PREFIX + "info", "Cette commande permet de faire un message dans le salon ``#information``.")
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
                 .addField(PREFIX + "ping", "Grâce à cette commande, tu pourras savoir mon ping !") 
                 .addField(PREFIX + "reseaux", "Vous donne les réseaux sociaux  de Zertek !")
                 .addField(PREFIX + "play", "Jouer une musique !  Pour l'utiliser, faites .play (lien) !")
                 .addField(PREFIX + "stop", "Arreter la musique  Pour l'utiliser, faites .stop !")
                 .addField(PREFIX + "servinfo", "Permet de voir les informations sur le discord !")
                 .addField(PREFIX + "serveur", "Pour voir nos serveurs !")
                 .addField(PREFIX + "web", "Pour accèder a notre site !")
                 .addField(PREFIX + "google", "Commande pas trop utile mais tu peut faire des recherche google. Pour l'utiliser, faites .google (recherche) !")
                 .addField(PREFIX + "shelp", "❌Afficher les commandes du staff. Mais seule ceux qui ont la perm de kick pourrons y accèder. ❌")
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
            if (reason.length < 1) return message.reply("Tu as oublié la raison ! :D");
            if (message.mentions.users.size < 1) return message.reply("Tu n'as pas mis son pseudo au complet ! :o")
            message.guild.member(user).kick();
            message.channel.send(user.toString() + " a bien été kick pour " + reason + " ✅")
            break;
      
        case "ban":
            if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande.");
            if(!modlog) return message.reply("Je ne trouve pas de channel log. Contacte mon créateur pour qu'il me dit qu'elle channel sert de log.");
            if (reason.length < 1) return message.reply("Tu as oublié la raison.");
            if (message.mentions.users.size < 1) return message.reply("Tu as oublié de préciser qui je dois bannir.")
            
            message.guild.ban(user, 2);
            message.channel.send(user.toString() + " a bien été banni pour " + reason + " ✅")

            break;
      
        case "purge":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
           message.channel.send("``" + messagecount + " messages`` on été supprimée !")
            break;

       case "reseaux":
            var embed = new Discord.RichEmbed()
                 .addField("Au passage", "Pense a a le follow !")
                 .addField("Twitter", "https://twitter.com/ZerTeK_")
                 .addField("Facebook", "https://www.facebook.com/ZerTeKyoutube/")
                 .addField("Google +", "https://plus.google.com/+ZerTeKYtube")
                 .addBlankField()
                 .addField("Twitch", "https://www.twitch.tv/zertek_")
                 .addField("Youtube", "https://www.youtube.com/channel/UCClwL97b82Rmw9CiVS0z9bw")             
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
                 .addBlankField()
                 .addField("Le Serveur Minecraft (CRACK + 1.8 - 1.12)", "​play.trust-gaming.fr")
                .setColor("#ffff00")
                .setFooter("Amuse toi bien sur nos serveur !")
                .setAuthor("Pannel des Serveurs")
                .setDescription("Petit rappelle, je vais seulement envoyé un liens pour que tu rejoins le serveur !")
                .setTimestamp()
                message.delete()
                message.channel.sendEmbed(embed)
            break; 

       case "ping":
            var ping_embed = new Discord.RichEmbed()
                .addField(':clock2: Calcul en cours...', "Merci de patienter quelques instants !")
            let startTime = Date.now();
            msg.channel.send(ping_embed).then(msg => msg.edit(pong_embed));
            const fs = require("fs");
            var pong_embed = new Discord.RichEmbed()
                .setColor('#ffff00')
                .addField('Mon Ping :', ':ping_pong: Pong !')
                .addField(":clock2: Temps :", `${Date.now() - startTime} millisecondes`, true)
                .addField(":heartpulse: API Discord :", `${bot.ping} millisecondes`, true)
        break; 
            
       case "google":
        let glg = message.content.split(' ');
        glg.shift();
        console.log("J'ai rechercher!");
        message.reply('https://www.google.fr/#q=' + glg.join('%20'));
        break;

       case "annoncesgmd":
         if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
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
         if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
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

       case "annoncesmc":
         if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
       let newir = message.content.split(" ");
       newi.shift();
     var embed = new Discord.RichEmbed()
     .addField("Annonces !", " "+ newir.join(" "))
     .setColor("#FFFB00")
     .setFooter("By Ilian ! ^^")
     message.delete();
     message.channel.send("@everyone Du nouveau sur le serveur")
     member.guild.channels.find("name", "annonces").sendEmbed(embed);
     break;      
      
       case "info":
         if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
       let infor = message.content.split(" ");
       newi.shift();
     var embed = new Discord.RichEmbed()
     .addField("Information !", " "+ infor.join(" "))
     .setColor("#FFFB00")
     .setFooter("By Ilian ! ^^")
     message.delete();
     message.channel.send("@everyone Du nouveau sur le serveur")
     member.guild.channels.find("name", "information").sendEmbed(embed);
     break;        
      
   case "traductionhelp":
   var embed = new Discord.RichEmbed()
        .addField(PREFIX + "tradenfr", "Traduction Anglais ==> Français !") 
        .addField(PREFIX + "tradfren", "Traduction Français ==> Anglais !")
        .addField(PREFIX + "tradesfr", "Traduction Espagnol ==> Français !")
        .addField(PREFIX + "tradfres", "Taduction Français ==> Espagnol !")
        .addField(PREFIX + "tradesen", "Traduction Espagnol ==> Anglais !")
        .addField(PREFIX + "tradenes", "Taduction Anglais ==> Espagnol !")            
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
        .addField("Forum", "[Voir](http://forum.trust-gaming.fr/)") 
        .addField("Panel", "[Voir](http://trust-gaming.fr/panel)")
        .addField("Membres", "[Voir](http://trust-gaming.fr/forum/memberlist.php)")        
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

bot.login(process.env.TOKEN);
