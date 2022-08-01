

module.exports = {
    getMember: function(message, toFind = "") {
      try{
        toFind = toFind.toLowerCase();
        let target = message.guild.members.get(toFind);
        if (!target && message.mentions.members) target = message.mentions.members.first();
        if (!target && toFind) {
          target = message.guild.members.find((member) => {
            return member.displayName.toLowerCase().includes(toFind) || member.user.tag.toLowerCase().includes(toFind);
          });
        }
        if (!target) target = message.member;
        return target;
      }catch (e){
        console.log(String(e.stack).bgRed)
      }
    },
    duration: function(ms) {
        const sec = Math.floor((ms / 1000) % 60).toString();
        const min = Math.floor((ms / (60 * 1000)) % 60).toString();
        const hrs = Math.floor((ms / (60 * 60 * 1000)) % 60).toString();
        const days = Math.floor((ms / (24 * 60 * 60 * 1000)) % 60).toString();
        return `\`${days}Days\`,\`${hrs}Hours\`,\`${min}Minutes\`,\`${sec}Seconds\``;
    },

    promptMessage: async function(message, author, time, validReactions) {
      try{
        time *= 1000;
        for (const reaction of validReactions) await message.react(reaction);
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;
        return message.awaitReactions(filter, {
          max: 1,
          time: time
        }).then((collected) => collected.first() && collected.first().emoji.name);
      }catch (e){
        console.log(String(e.stack).bgRed)
      }
    },

    delay: function(delayInms) {
      try{
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(2);
          }, delayInms);
        });
      }catch (e){
        console.log(String(e.stack).bgRed)
      }
    },

    getRandomInt: function(max) {
      try{
        return Math.floor(Math.random() * Math.floor(max));
      }catch (e){
        console.log(String(e.stack).bgRed)
      }
    },

    getRandomNum: function(min, max) {
      try{
        return Math.floor(Math.random() * Math.floor((max - min) + min));
      }catch (e){
        console.log(String(e.stack).bgRed)
      }
    },

    createBar: function(current, total , size = 25, line = "▬", slider = "🔶") {
      try {
        if (!total) throw "MISSING MAX TIME";
        if (!current) return `**[${slider}${line.repeat(size - 1)}]**`;
        let bar = current > total 
            ? [line.repeat(size / 2 * 2), (current / total) * 100] 
            : [line.repeat(Math.round(size / 2 * (current / total))).replace(/.$/, slider) 
              + line.repeat(size - Math.round(size * (current / total)) + 1), current / total];
        if (!String(bar).includes(slider)) {
          return `**[${slider}${line.repeat(size - 1)}]**`;
        } else{
          return `**[${bar[0]}]**`;
        }
      } catch (e) {
        console.log(String(e.stack).bgRed)
      }
    },

    
    format: function(millis) {
      try{
        var h = Math.floor(millis / 3600000),
          m = Math.floor(millis / 60000),
          s = ((millis % 60000) / 1000).toFixed(0);
        if (h < 1) return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
        else return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
      }catch (e){
        console.log(String(e.stack).bgRed)
      }
    },
    escapeRegex: function(str) {
      try{
        return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
      }catch (e){
        console.log(String(e.stack).bgRed)
      }
    },
    arrayMove: function(array, from, to) {
      try{
        array = [...array];
        const startIndex = from < 0 ? array.length + from : from;
        if (startIndex >= 0 && startIndex < array.length) {
          const endIndex = to < 0 ? array.length + to : to;
          const [item] = array.splice(from, 1);
          array.splice(endIndex, 0, item);
        }
        return array;
      }catch (e){
        console.log(String(e.stack).bgRed)
      }
    }

    
  }
  