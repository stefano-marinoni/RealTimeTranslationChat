using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealTimeTranslationChat.Models
{
    public class DetectedLanguage
    {
        public string language { get; set; }
        public double score { get; set; }
    }
}
